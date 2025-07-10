import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    // Fallback values - these will be overridden by runtime env vars
    NOCODB_URL: process.env.NOCODB_URL || '',
    NOCODB_API_KEY: process.env.NOCODB_API_KEY || '',
    NOCODB_TABLE_NAME: process.env.NOCODB_TABLE_NAME || '',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

export default nextConfig;
