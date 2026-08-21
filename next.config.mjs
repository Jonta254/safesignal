/** @type {import('next').NextConfig} */
const securityHeaders=[
 {key:'X-DNS-Prefetch-Control',value:'on'},
 {key:'Strict-Transport-Security',value:'max-age=63072000; includeSubDomains; preload'},
 {key:'X-Frame-Options',value:'DENY'},
 {key:'X-Content-Type-Options',value:'nosniff'},
 {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
 {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(self), browsing-topics=()'},
 {key:'Content-Security-Policy',value:["default-src 'self'","script-src 'self' 'unsafe-inline'","style-src 'self' 'unsafe-inline' https://fonts.googleapis.com","font-src 'self' https://fonts.gstatic.com","img-src 'self' data: blob:","connect-src 'self'","frame-ancestors 'none'","base-uri 'self'","form-action 'self'","object-src 'none'"].join('; ')}
];
const nextConfig={turbopack:{root:process.cwd()},async headers(){return[{source:'/(.*)',headers:securityHeaders}]},poweredByHeader:false};
export default nextConfig;
