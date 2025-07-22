import { cookies } from 'next/headers';
import { AppSidebar } from '@/components/chatbot/app-sidebar';
import { Chat } from '@/components/chatbot/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/chatbot/ai/models';
import { SidebarInset, SidebarProvider } from '@/components/chatbot/ui/sidebar';
import { SiteHeader } from "@/components/site-header"

import { generateUUID } from '@/lib/chatbot/utils';
import { DataStreamHandler } from '@/components/chatbot/data-stream-handler';
// import { auth } from '../(auth)/auth';
import { createClient } from '@/lib/supabase/server';
import type { Session } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();
  const { data: { session } }: { data: { session: Session | null } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!session) {
    redirect('/auth/login');
  } 
  const [cookieStore] = await Promise.all([cookies()]);

  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'false';

  const id = generateUUID();

  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <div>
        <SiteHeader title="AI Assistant" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <SidebarProvider defaultOpen={!isCollapsed}>
              <AppSidebar user={user} />
              <SidebarInset>
                <Chat
                  key={id}
                  id={id}
                  initialMessages={[]}
                  initialChatModel={DEFAULT_CHAT_MODEL}
                  initialVisibilityType="private"
                  isReadonly={false}
                  sessionId={session.user.id}
                  autoResume={false}
                />
                <DataStreamHandler />
              </SidebarInset>
            </SidebarProvider>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader title="AI Assistant" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <SidebarProvider defaultOpen={!isCollapsed}>
            <AppSidebar user={user} />
            <SidebarInset>
              <Chat
                key={id}
                id={id}
                initialMessages={[]}
                initialChatModel={modelIdFromCookie.value}
                initialVisibilityType="private"
                isReadonly={false}
                sessionId={session.user.id}
                autoResume={false}
              />
              <DataStreamHandler />
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </div>

  );
}


// // app/dashboard/ai-assistant/page.tsx
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { generateUUID } from '@/lib/chatbot/utils';
// import PageClient from './PageClient';

// export default async function Page() {
//   const cookieStore = await cookies();

//   const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'false';
//   const modelIdFromCookie = cookieStore.get('chat-model')?.value || null;

//   const id = generateUUID();

//   return (
//     <PageClient
//       chatId={id}
//       isCollapsed={isCollapsed}
//       modelId={modelIdFromCookie}
//     />
//   );
// }


