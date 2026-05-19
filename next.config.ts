import type { NextConfig } from "next";

const RAILWAY_API = "https://zucchini-fascination-production.up.railway.app";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: `${RAILWAY_API}/auth/:path*` },
      { source: "/users/:path*", destination: `${RAILWAY_API}/users/:path*` },
      { source: "/products/:path*", destination: `${RAILWAY_API}/products/:path*` },
      { source: "/categories/:path*", destination: `${RAILWAY_API}/categories/:path*` },
      { source: "/suppliers/:path*", destination: `${RAILWAY_API}/suppliers/:path*` },
      { source: "/sales/:path*", destination: `${RAILWAY_API}/sales/:path*` },
      { source: "/purchase/:path*", destination: `${RAILWAY_API}/purchase/:path*` },
      { source: "/inventory/:path*", destination: `${RAILWAY_API}/inventory/:path*` },
      { source: "/returns/:path*", destination: `${RAILWAY_API}/returns/:path*` },
      { source: "/dashboard/:path*", destination: `${RAILWAY_API}/dashboard/:path*` },
      { source: "/reports/:path*", destination: `${RAILWAY_API}/reports/:path*` },
      { source: "/upload/:path*", destination: `${RAILWAY_API}/upload/:path*` },
      { source: "/admin/:path*", destination: `${RAILWAY_API}/admin/:path*` },
      { source: "/ai/:path*", destination: `${RAILWAY_API}/ai/:path*` },
      { source: "/ai-data/:path*", destination: `${RAILWAY_API}/ai-data/:path*` },
      { source: "/activity-log/:path*", destination: `${RAILWAY_API}/activity-log/:path*` },
      { source: "/health", destination: `${RAILWAY_API}/health` },
    ];
  },
};

export default nextConfig;
