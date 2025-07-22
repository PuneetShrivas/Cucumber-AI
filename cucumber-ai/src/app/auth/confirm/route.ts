import { createClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { createUser } from '@/lib/chatbot/db/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const _next = searchParams.get('next')
  const next = _next?.startsWith('/') ? _next : '/'

  if (token_hash && type) {
    const supabase = await createClient()
    async function createOrganization(restaurantName: string) {
      // Generate a slug from the restaurant name
      const slug = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { data, error } = await supabase
        .from('organizations')
        .insert([
          {
            name: restaurantName,
            slug,
            // other fields will use their default values
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      if (type === 'email') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !user.user_metadata.organization_id) {
          // Create organization if user doesn't have one
          const organization = await createOrganization(user.user_metadata.restaurant_name || 'Default Restaurant');
          await supabase.auth.updateUser({
            data: { organization_id: organization.id },
          });
        }
        if (user && user.email) {
          console.log('Creating user with email:', user.email);
          const newUser = await createUser(user.id, user?.email, 'password')
          console.log('New user created:', newUser);
        }
        // Insert profile for the user
        if (user && user.id) {
          console.log('Inserting profile for user:', user.id);
          await supabase.from('profiles').insert({
            id: user.id,
            type: 'regular' // or 'guest'
          });
        }
      }
      redirect(next)
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`)
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=No token hash or type`)
}
