// src/libs/supabase.ts
import { createClient } from '@supabase/supabase-js'

const { supabase_project_url, supabase_service_role } = process.env

export const supabase = createClient(supabase_project_url!, supabase_service_role!)