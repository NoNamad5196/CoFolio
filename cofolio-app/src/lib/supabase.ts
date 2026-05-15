import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
)

export interface DbProfile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface DbPortfolio {
  id: string
  user_id: string
  slug: string
  is_published: boolean
  builder_state: Record<string, unknown> | null
  portfolio_result: Record<string, unknown> | null
  view_count: number
  created_at: string
  updated_at: string
}
