import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qugmzkgsmfpvhalsswco.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Z216a2dzbWZwdmhhbHNzd2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODc3NTgsImV4cCI6MjA0NzA2Mzc1OH0.5pL9e7wslaJMFCJPh5pRoF19fgNAXYacA3hZou9Wgi4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
