import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from 'ai';
// import { auth, type UserType } from '@/app/(auth)/auth';
import { UserType } from '@/lib/chatbot/types';
import { createClient } from '@/lib/supabase/server'
import { type RequestHints, systemPrompt } from '@/lib/chatbot/ai/prompts';
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from '@/lib/chatbot/db/queries';
import { convertToUIMessages, generateUUID } from '@/lib/chatbot/utils';
import { generateTitleFromUserMessage } from '@/app/dashboard/ai-assistant/actions';
import { createDocument } from '@/lib/chatbot/ai/tools/create-document';
import { updateDocument } from '@/lib/chatbot/ai/tools/update-document';
import { requestSuggestions } from '@/lib/chatbot/ai/tools/request-suggestions';
import { getWeather, getLatLongFromCity } from '@/lib/chatbot/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/chatbot/constants';
import { myProvider } from '@/lib/chatbot/ai/providers';
import { entitlementsByUserType } from '@/lib/chatbot/ai/entitlements';
import { postRequestBodySchema, type PostRequestBody } from './schema';
import {generateSQL, executeSQL, assessSQLSafety, checkSQLStatement} from '@/lib/chatbot/ai/tools/supabase-queries';
import { geolocation } from '@vercel/functions';
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from 'resumable-stream';
import { after } from 'next/server';
import { ChatSDKError } from '@/lib/chatbot/errors';
import type { ChatMessage } from '@/lib/chatbot/types';
import type { ChatModel } from '@/lib/chatbot/ai/models';
import type { VisibilityType } from '@/components/chatbot/visibility-selector';

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('REDIS_URL')) {
        console.log(
          ' > Resumable streams are disabled due to missing REDIS_URL',
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    console.error('Invalid request body:', _);
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
      organizationId,
      activeLocation,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel['id'];
      selectedVisibilityType: VisibilityType;
      organizationId: string;
      activeLocation: string;
    } = requestBody;
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    // const {data: userData, error: userError} = await supabase.auth.getUser();

    if (!session?.user) {
      console.log('Session not found, returning unauthorized error');
      return new ChatSDKError('unauthorized:chat').toResponse();
    }
    const userId = session.user.id;

    // 2. Get the user type from the 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    const userType: UserType = profile.type as UserType || 'guest';
      

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      console.log(
        `User ${userId} exceeded message limit: ${messageCount} messages`,
      );
      return new ChatSDKError('rate_limit:chat').toResponse();
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== session.user.id) {
        console.log('User is not the owner of the chat');
        return new ChatSDKError('forbidden:chat').toResponse();
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: 'user',
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });
    // console.log('organizationId:', organizationId);
    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel, requestHints, organizationId, activeLocation, userId }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                'getWeather',
                'getLatLongFromCity',
                'createDocument',
                'updateDocument',
                'requestSuggestions',
                // 'getOrganizationDetails',
                'generateSQL',
                'executeSQL',
                'assessSQLSafety',
                'checkSQLStatement',
              ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          tools: {
            getWeather,
            getLatLongFromCity,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
            // getOrganizationDetails,
            generateSQL,
            executeSQL,
            assessSQLSafety,
            checkSQLStatement,
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();
        // console.log(result.steps, 'Steps taken in the stream');
        // console.log(result.reasoningText, 'Reasoning text');
        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          }),
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        await saveMessages({
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            parts: message.parts,
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });
      },
      onError: () => {
        console.error('An error occurred while processing the chat request');
        return 'Oops, an error occurred!';
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () =>
          stream.pipeThrough(new JsonToSseTransformStream()),
        ),
      );
    } else {
      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    }
  } catch (error) {
     if (error instanceof ChatSDKError) {
    console.error('ChatSDKError occurred:', error.message);
    return error.toResponse();
  } else {
    console.error('Unhandled error occurred:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api').toResponse();
  }
  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  // const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
