import {NextResponse} from "next/server";
import {anonymizeIp,normalizeEmail,requestId,safeWebhookUrl} from "@/lib/security";
const attempts=new Map<string,{count:number;resetAt:number}>();
const MAX_BODY_BYTES=1024;
const responseHeaders={"Cache-Control":"no-store, max-age=0","X-Content-Type-Options":"nosniff"};
function json(body:Record<string,unknown>,status=200,id?:string){return NextResponse.json(body,{status,headers:{...responseHeaders,...(id?{"X-Request-ID":id}:{})}})}
export async function POST(request:Request){
 const id=requestId(request.headers.get("x-request-id"));
 const length=Number(request.headers.get("content-length")||0);if(length>MAX_BODY_BYTES)return json({error:"Request is too large."},413,id);
 if(request.headers.get("sec-fetch-site")==="cross-site")return json({error:"Cross-site requests are not accepted."},403,id);
 const forwarded=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";const key=anonymizeIp(forwarded);const now=Date.now();const current=attempts.get(key);
 if(current&&current.resetAt>now&&current.count>=5)return json({error:"Too many requests. Please try again later."},429,id);
 attempts.set(key,{count:current&&current.resetAt>now?current.count+1:1,resetAt:current&&current.resetAt>now?current.resetAt:now+60*60_000});
 let body:unknown;try{body=await request.json()}catch{return json({error:"Invalid request."},400,id)}
 const email=normalizeEmail(typeof body==="object"&&body!==null&&"email" in body?(body as {email:unknown}).email:null);if(!email)return json({error:"Enter a valid email address."},400,id);
 const webhook=safeWebhookUrl(process.env.WAITLIST_WEBHOOK_URL);if(!webhook)return json({error:"Waitlist capture is not configured yet."},503,id);
 try{const response=await fetch(webhook,{method:"POST",headers:{"content-type":"application/json","x-request-id":id},body:JSON.stringify({email,source:"safesignal-web",createdAt:new Date().toISOString()}),signal:AbortSignal.timeout(8_000),redirect:"error"});if(!response.ok)throw new Error("Provider rejected request");return json({ok:true},200,id)}catch{return json({error:"We could not save your email. Please try again."},502,id)}
}