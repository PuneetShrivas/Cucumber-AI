import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/chatbot/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import { auth } from '../(auth)/auth';
import {createClient} from '@/lib/supabase/server';
import Script from 'next/script';
import { DataStreamProvider } from '@/components/chatbot/data-stream-provider';
import { redirect } from 'next/navigation';
export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.log("error fetching session: ", session);
    return redirect('/auth/login');
  }
  return (  
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
      {/* <SessionContextProvider session={session}> */}
        {children}
      {/* </SessionContextProvider> */}
      </DataStreamProvider>
    </>
  );
}
