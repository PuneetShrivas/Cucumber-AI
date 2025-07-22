import React from 'react';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from '@/components/themeProvider';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createUser, getUserById } from '@/lib/chatbot/db/queries';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient(
  );
  const { data, error } = await supabase.auth.getUser()
  if (!data.user || error) {
    return redirect('/auth/login');
  }
  const user = data.user;
  // check if the user is in the User table and profile table. if not then use createUser function to create a new user and add profile using supabase functions
  const userData = await getUserById(user.id);
  // console.log('User data:', userData);
  if (userData.length === 0 && user.email) {
    const newUser = await createUser(user.id, user.email, 'password');
    console.log('New user created:', newUser);
    // Insert profile for the user
    await supabase.from('profiles').insert({
      id: user.id,
      type: 'regular', // or 'guest'
    });
  }
  
  // // Insert profile for the user
  // if (user && user.id) {
  //   console.log('Inserting profile for user:', user.id);
  //   await supabase.from('profiles').insert({
  //     id: user.id,
  //     type: 'regular' // or 'guest'
  //   });
  // }
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <AppSidebar variant="inset" />
              <SidebarInset>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </>

  )
}