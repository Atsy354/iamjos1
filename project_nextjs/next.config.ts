import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set turbopack root to fix workspace root inference issue
  // This ensures Next.js knows where the project root is located
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  turbopack: {
    root: path.resolve(__dirname),
  } as any,
};

export default nextConfig;
