/** @type {import('next').NextConfig} */
const isProduction=process.env.NODE_ENV==="production";
const contentSecurityPolicy=[
 "default-src 'self'",
 "script-src 'self' 'unsafe-inline'",
 "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
 "font-src 'self' https://fonts.gstatic.com",
 "img-src 'self' data: blob:",
 "connect-src 'self'",
 "frame-ancestors 'none'",
 "base-uri 'self'",
 "form-action 'self'",
 "object-src 'none'",
 ...(isProduction?["upgrade-insecure-requests"]:[])
].join("; ");
const securityHeaders=[
 {key:"X-DNS-Prefetch-Control",value:"off"},
 {key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains; preload"},
 {key:"X-Frame-Options",value:"DENY"},
 {key:"X-Content-Type-Options",value:"nosniff"},
 {key:"X-Permitted-Cross-Domain-Policies",value:"none"},
 {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
 {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(self), browsing-topics=(), payment=(), usb=()"},
 {key:"Cross-Origin-Opener-Policy",value:"same-origin"},
 {key:"Cross-Origin-Resource-Policy",value:"same-origin"},
 {key:"Content-Security-Policy",value:contentSecurityPolicy}
];
const nextConfig={turbopack:{root:process.cwd()},async headers(){return[{source:"/(.*)",headers:securityHeaders},{source:"/api/:path*",headers:[{key:"Cache-Control",value:"no-store, max-age=0"}]}]},poweredByHeader:false};
export default nextConfig;