import { NextResponse } from "next/server";

const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts=new Map<string,{count:number;resetAt:number}>();
export async function POST(request:Request){
 const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";const now=Date.now();const current=attempts.get(ip);
 if(current&&current.resetAt>now&&current.count>=5)return NextResponse.json({error:"Too many requests. Please try again later."},{status:429});
 attempts.set(ip,{count:current&&current.resetAt>now?current.count+1:1,resetAt:current&&current.resetAt>now?current.resetAt:now+60*60_000});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:"Invalid request."},{status:400})}
 const email=typeof body==="object"&&body!==null&&"email" in body?String(body.email).trim().toLowerCase():"";
 if(!EMAIL.test(email)||email.length>254)return NextResponse.json({error:"Enter a valid email address."},{status:400});
 const webhook=process.env.WAITLIST_WEBHOOK_URL;if(!webhook)return NextResponse.json({error:"Waitlist capture is not configured yet."},{status:503});
 try{const response=await fetch(webhook,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,source:"safesignal-web",createdAt:new Date().toISOString()}),signal:AbortSignal.timeout(8_000)});if(!response.ok)throw new Error(`Webhook ${response.status}`);return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"We could not save your email. Please try again."},{status:502})}
}
