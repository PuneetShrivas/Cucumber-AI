import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
      
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        redirect('/dashboard')
      }
    return (
        <div
            style={{
          backgroundColor: "#f5fffa",
          backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%2366ad86\' fill-opacity=\'0.4\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E")',
            }}
        >
            {children}
        </div>
    );
}