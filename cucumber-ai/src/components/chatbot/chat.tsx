'use client';

import { DefaultChatTransport, tool } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chatbot/chat-header';
import type { Vote } from '@/lib/chatbot/db/schema';
import { fetcher, fetchWithErrorHandlers, generateUUID } from '@/lib/chatbot/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/chatbot/use-artifact';
import { unstable_serialize } from 'swr/infinite';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { toast } from './toast';
// import type { Session } from 'next-auth';
import { createClient } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import { useChatVisibility } from '@/hooks/chatbot/use-chat-visibility';
import { useAutoResume } from '@/hooks/chatbot/use-auto-resume';
import { ChatSDKError } from '@/lib/chatbot/errors';
import type { Attachment, ChatMessage } from '@/lib/chatbot/types';
import { useDataStream } from './data-stream-provider';
import { user } from './../../lib/chatbot/db/schema';
import { ViewDisplay } from './view-display';

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  sessionId,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  sessionId: string;
  autoResume: boolean;
}) {
  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });

  const { mutate } = useSWRConfig();
  const { setDataStream } = useDataStream();
  const [input, setInput] = useState<string>('');
  const [toolCall, setToolCall] = useState<string>('');
 
  const organizationId = window.localStorage.getItem('organizationId') || '';
  const activeLocation = window.localStorage.getItem('activeLocation') || '';
  console.log('Organization ID:', organizationId, 'Active Location:', activeLocation);
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: '/api/chatbot/chat',
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            message: messages.at(-1),
            selectedChatModel: initialChatModel,
            selectedVisibilityType: visibilityType,
            organizationId,
            activeLocation,
            ...body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
    },
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast({
          type: 'error',
          description: error.message,
        });
      }
    },
    onToolCall({ toolCall }: { toolCall: { toolName: string } }) {
      setToolCall(toolCall.toolName)
      if (toolCall.toolName === 'displayView') {
        // Handle displayView tool call
      }
    }
  });
  const [displayView, setDisplayView] = useState<string | null>('menu');
  // const displayView = 'menu'
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        role: 'user' as const,
        parts: [{ type: 'text', text: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/chatbot/vote?chatId=${id}` : null,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-[calc(100vh-4rem)] bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={initialChatModel}
          selectedVisibilityType={initialVisibilityType}
          isReadonly={isReadonly}
          sessionId={sessionId}
        />
        {displayView ? (
          <div className="px-4 h-full w-full flex flex-row gap-2">
            <ViewDisplay view="menu" setDisplayViewAction={setDisplayView} />
            <div className="flex flex-col w-1/2">
              <Messages
                chatId={id}
                status={status}
                votes={votes}
                messages={messages}
                toolCall={toolCall}
                setMessages={setMessages}
                regenerate={regenerate}
                isReadonly={isReadonly}
                isArtifactVisible={isArtifactVisible}
              />
              <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
                {!isReadonly && (
                  <MultimodalInput
                    chatId={id}
                    input={input}
                    setInput={setInput}
                    status={status}
                    stop={stop}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    messages={messages}
                    setMessages={setMessages}
                    sendMessage={sendMessage}
                    selectedVisibilityType={visibilityType}
                  />
                )}
              </form>
            </div>
          </div>
        ) : (
            <div className="flex flex-col h-full">
            <Messages
              chatId={id}
              status={status}
              votes={votes}
              messages={messages}
              toolCall={toolCall}
              setMessages={setMessages}
              regenerate={regenerate}
              isReadonly={isReadonly}
              isArtifactVisible={isArtifactVisible}
            />
            <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
              {!isReadonly && (
                <MultimodalInput
                  chatId={id}
                  input={input}
                  setInput={setInput}
                  status={status}
                  stop={stop}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  messages={messages}
                  setMessages={setMessages}
                  sendMessage={sendMessage}
                  selectedVisibilityType={visibilityType}
                />
              )}
            </form>
          </div>
        )}
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        sendMessage={sendMessage}
        messages={messages}
        setMessages={setMessages}
        regenerate={regenerate}
        votes={votes}
        isReadonly={isReadonly}
        selectedVisibilityType={visibilityType}
      />

    </>
  );
}
