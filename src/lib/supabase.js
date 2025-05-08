import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user
}

// Helper function to get user profile
export const getUserProfile = async () => {
  const user = await getCurrentUser()

  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

// Helper function to get avatar URL
export const getAvatarUrl = async (path) => {
  if (!path) return null

  try {
    const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60) // 1 hour expiry

    if (error) throw error

    return data.signedUrl
  } catch (error) {
    console.error("Error getting avatar URL:", error)
    return null
  }
}
