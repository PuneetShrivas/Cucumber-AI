import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/chatbot/ui/sidebar';
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from '@/components/chatbot/app-sidebar';
import type { AuthSession } from '@supabase/supabase-js';
// import { auth } from '@/app/(auth)/auth';
import { createClient } from '@/lib/supabase/server';
import { Chat } from '@/components/chatbot/chat';
import { getChatById, getMessagesByChatId } from '@/lib/chatbot/db/queries';
import { DataStreamHandler } from '@/components/chatbot/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/chatbot/ai/models';
import { convertToUIMessages } from '@/lib/chatbot/utils';
import { user } from './../../../../../lib/chatbot/db/schema';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    console.log('Chat not found for id:', id);
    notFound();
  }
  const supabase = await createClient();
  const { data: { session } }: { data: { session: any } } = await supabase.auth.getSession();
  // const session = await auth();
  const user = session?.user;
  const isCollapsed = false; // Default to false if no cookie is set

  // if (!session) {
  //   console.log(session, 'No session found');
  //   // redirect('/auth/login');
  //   console.log('No session found, redirecting to login');
  // }

  if (chat.visibility === 'private') {
    if (!user) {
      console.log('User not found, returning not found');
      return notFound();
    }

    if (user.id !== chat.userId) {
      console.log('User does not have access to this chat, returning not found');
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  if (!chatModelFromCookie) {
    return (
      <div>
        <SiteHeader title="AI Assistant" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <SidebarProvider defaultOpen={!isCollapsed}>
              <AppSidebar user={user} />
              <SidebarInset>
                <Chat
                  id={chat.id}
                  initialMessages={uiMessages}
                  initialChatModel={DEFAULT_CHAT_MODEL}
                  initialVisibilityType={chat.visibility}
                  isReadonly={session?.user?.id !== chat.userId}
                  sessionId={session.user.id}
                  autoResume={true}
                />
                <DataStreamHandler />
                <DataStreamHandler />
              </SidebarInset>
            </SidebarProvider>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={uiMessages}
        initialChatModel={chatModelFromCookie.value}
        initialVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
        sessionId={session.user.id}
        autoResume={true}
      />
      <DataStreamHandler />
    </>
  );
}
