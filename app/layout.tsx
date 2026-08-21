import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"),title:{default:"SafeSignal | Lone-worker check-in safety",template:"%s | SafeSignal"},description:"Recoverable lone-worker check-in sessions with optional GPS evidence, clear overdue states and local session records.",keywords:["lone worker safety","worker check-in","field worker safety","GPS check-in"],openGraph:{title:"SafeSignal | Lone-worker check-in safety",description:"A clear on-device check-in workflow for people working alone.",type:"website",images:[{url:"/safesignal-industrial-hero.png",width:1680,height:945,alt:"Lone electrical maintenance worker in an industrial plant room"}]}};
export const viewport:Viewport={themeColor:"#0b0d0f",colorScheme:"dark"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
