import { createClient } from '@/lib/supabase/server'
import { useEffect, useState } from 'react'

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileName = async () => {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error(error)
      }

      setName(data.session?.user.user_metadata.name ?? '?')
    }

    fetchProfileName()
  }, [])

  return name || '?'
}
