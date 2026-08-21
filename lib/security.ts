import {createHash,randomUUID} from "node:crypto";
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function normalizeEmail(value:unknown):string|null{if(typeof value!=="string")return null;const email=value.trim().toLowerCase();return email.length<=254&&EMAIL.test(email)?email:null}
export function requestId(value:string|null):string{return value&&/^[a-zA-Z0-9._-]{8,100}$/.test(value)?value:randomUUID()}
export function anonymizeIp(value:string):string{return createHash("sha256").update(value).digest("hex").slice(0,16)}
export function safeWebhookUrl(value:string|undefined,nodeEnv=process.env.NODE_ENV):URL|null{if(!value)return null;try{const url=new URL(value);if(url.username||url.password)return null;if(url.protocol==="https:")return url;if(nodeEnv!=="production"&&url.protocol==="http:"&&["localhost","127.0.0.1","::1"].includes(url.hostname))return url;return null}catch{return null}}
export function csvSafeCell(value:unknown):string{const raw=String(value??"").replaceAll("\0","");const protectedValue=/^[=+\-@]/.test(raw.trimStart())?"'"+raw:raw;return `"${protectedValue.replaceAll('"','""')}"`}
export function boundedText(value:unknown,max:number):string|null{if(typeof value!=="string")return null;const normalized=value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"");return normalized&&normalized.length<=max?normalized:null}