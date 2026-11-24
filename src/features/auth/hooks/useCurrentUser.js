import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

export function useCurrentUser() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user);
    }

    getUser()
  }, [])

  return user
}