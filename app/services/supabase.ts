import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qjirxlpcaybtayjshpex.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXJ4bHBjYXlidGF5anNocGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzMyNzgsImV4cCI6MjA3OTc0OTI3OH0.71L8vAI4AwKZsWNzScmueqWEOKlVpuO4WjARGiEVvds";
export const supabase = createClient(supabaseUrl, supabaseKey);
