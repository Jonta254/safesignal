export const ACTIVE_SESSION_KEY = "ss_active_session_v2";
export const SESSION_HISTORY_KEY = "ss_sessions_v2";
export const LEGACY_HISTORY_KEY = "ss_sessions";
export const SESSION_SCHEMA_VERSION = 3;
export const GRACE_SECONDS = 120;
export const STALE_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export type Phase = "active" | "grace" | "overdue";
export type LocationFix = { lat:number; lng:number; accuracy:number; capturedAt:string };
export type CheckIn = { id:string; time:string; location?:LocationFix };
export type PermissionState = "granted" | "prompt" | "denied" | "unavailable" | "unknown";
export type ActiveSession = {
  version:3; id:string; worker:string; site:string; task:string; safetyNotes:string;
  emergencyName:string; emergencyPhone:string; emergencyContactConfirmed:boolean;
  intervalMinutes:number; expectedDurationMinutes:number; startedAt:string; expectedEndAt:string;
  deadlineAt:string; graceDeadlineAt?:string; phase:Phase; checkIns:CheckIn[];
  missedCheckIns:number; initialLocation?:LocationFix; notificationPermission:PermissionState;
};
export type StoredSession = ActiveSession & { endedAt:string; outcome:"completed"|"ended-in-grace"|"ended-overdue" };
export type SessionReadResult = { status:"none" } | { status:"valid"|"stale"; session:ActiveSession } | { status:"corrupt"; raw:string };
export type TimerState = "normal"|"approaching"|"due-soon"|"grace"|"overdue";

type LegacyActive = Partial<Omit<ActiveSession,"version"|"phase">> & { version?:2|3; phase?:"active"|"alert"|Phase };

export function remainingSeconds(deadline:string, now=Date.now()):number {
  const target=new Date(deadline).getTime();
  return Number.isFinite(target)?Math.max(0,Math.ceil((target-now)/1000)):0;
}
export function nextDeadline(intervalMinutes:number, now=Date.now()):string {
  return new Date(now+intervalMinutes*60_000).toISOString();
}
export function deriveTimerState(session:ActiveSession,now=Date.now()):TimerState {
  if(session.phase==="overdue")return "overdue";
  if(session.phase==="grace")return remainingSeconds(session.graceDeadlineAt||session.deadlineAt,now)>0?"grace":"overdue";
  const left=remainingSeconds(session.deadlineAt,now);
  if(left<=60)return "due-soon";
  if(left<=Math.min(300,Math.max(120,session.intervalMinutes*60*.2)))return "approaching";
  return "normal";
}
export function isActiveSession(value:unknown):value is ActiveSession {
  if(!value||typeof value!=="object")return false;
  const s=value as Partial<ActiveSession>;
  const dates=[s.startedAt,s.expectedEndAt,s.deadlineAt].every(v=>typeof v==="string"&&Number.isFinite(Date.parse(v)));
  return s.version===3&&typeof s.id==="string"&&Boolean(s.id)&&typeof s.worker==="string"&&Boolean(s.worker.trim())&&typeof s.site==="string"&&typeof s.task==="string"&&typeof s.intervalMinutes==="number"&&s.intervalMinutes>0&&typeof s.expectedDurationMinutes==="number"&&s.expectedDurationMinutes>0&&dates&&(s.phase==="active"||s.phase==="grace"||s.phase==="overdue")&&Array.isArray(s.checkIns);
}
function migrateActive(value:unknown):ActiveSession|null {
  if(isActiveSession(value))return value;
  if(!value||typeof value!=="object")return null;
  const s=value as LegacyActive;
  if(s.version!==2||typeof s.id!=="string"||typeof s.worker!=="string"||typeof s.startedAt!=="string"||typeof s.deadlineAt!=="string"||!Number.isFinite(Date.parse(s.startedAt))||!Number.isFinite(Date.parse(s.deadlineAt))||!Array.isArray(s.checkIns))return null;
  const interval=typeof s.intervalMinutes==="number"&&s.intervalMinutes>0?s.intervalMinutes:30;
  const expectedDuration=typeof s.expectedDurationMinutes==="number"&&s.expectedDurationMinutes>0?s.expectedDurationMinutes:interval;
  return {version:3,id:s.id,worker:s.worker,site:typeof s.site==="string"?s.site:"",task:typeof s.task==="string"?s.task:"Not recorded",safetyNotes:typeof s.safetyNotes==="string"?s.safetyNotes:"",emergencyName:typeof s.emergencyName==="string"?s.emergencyName:"",emergencyPhone:typeof s.emergencyPhone==="string"?s.emergencyPhone:"",emergencyContactConfirmed:Boolean(s.emergencyContactConfirmed),intervalMinutes:interval,expectedDurationMinutes:expectedDuration,startedAt:s.startedAt,expectedEndAt:typeof s.expectedEndAt==="string"?s.expectedEndAt:new Date(Date.parse(s.startedAt)+expectedDuration*60_000).toISOString(),deadlineAt:s.deadlineAt,graceDeadlineAt:s.graceDeadlineAt,phase:s.phase==="alert"?"grace":s.phase||"active",checkIns:s.checkIns,missedCheckIns:typeof s.missedCheckIns==="number"?s.missedCheckIns:0,initialLocation:s.initialLocation,notificationPermission:s.notificationPermission||"unknown"};
}
export function readActiveSessionResult(now=Date.now()):SessionReadResult {
  let raw:string|null=null;
  try { raw=localStorage.getItem(ACTIVE_SESSION_KEY); if(!raw)return {status:"none"}; const migrated=migrateActive(JSON.parse(raw)); if(!migrated)return {status:"corrupt",raw}; if(migrated.version===3&&JSON.parse(raw).version===2)writeActiveSession(migrated); const age=now-Date.parse(migrated.startedAt); return {status:age>STALE_SESSION_MS?"stale":"valid",session:migrated}; } catch { return raw?{status:"corrupt",raw}:{status:"none"}; }
}
export function readActiveSession():ActiveSession|null { const result=readActiveSessionResult(); return result.status==="valid"||result.status==="stale"?result.session:null; }
export function writeActiveSession(session:ActiveSession):boolean { try { localStorage.setItem(ACTIVE_SESSION_KEY,JSON.stringify(session)); return true } catch { return false } }
export function clearActiveSession():boolean { try { localStorage.removeItem(ACTIVE_SESSION_KEY); return true } catch { return false } }
export function archiveSession(session:ActiveSession,endedAt=new Date().toISOString()):StoredSession {
  const outcome=session.phase==="overdue"?"ended-overdue":session.phase==="grace"?"ended-in-grace":"completed";
  const archived:StoredSession={...session,endedAt,outcome};
  try { const history=readSessionHistory(); localStorage.setItem(SESSION_HISTORY_KEY,JSON.stringify([archived,...history.filter(item=>item.id!==session.id)].slice(0,50))); } catch { /* Report remains available in memory. */ }
  return archived;
}
export type SessionHistoryReadResult={status:"ok"|"empty"|"corrupt"|"unavailable";sessions:StoredSession[]};
export function readSessionHistoryResult():SessionHistoryReadResult {
  let currentRaw:string|null=null;
  try {
    currentRaw=localStorage.getItem(SESSION_HISTORY_KEY);
    if(currentRaw){
      let current:unknown;
      try{current=JSON.parse(currentRaw)}catch{return {status:"corrupt",sessions:[]}}
      if(!Array.isArray(current))return {status:"corrupt",sessions:[]};
      const sessions=current.flatMap((item:unknown):StoredSession[]=>{const active=migrateActive(item);const value=item as Partial<StoredSession>;return active&&typeof value.endedAt==="string"&&Number.isFinite(Date.parse(value.endedAt))?[{...active,endedAt:value.endedAt,outcome:value.outcome||"completed"}]:[]});
      return {status:sessions.length===current.length?(sessions.length?"ok":"empty"):"corrupt",sessions};
    }
    const legacyRaw=localStorage.getItem(LEGACY_HISTORY_KEY);
    if(!legacyRaw)return {status:"empty",sessions:[]};
    let legacy:unknown;try{legacy=JSON.parse(legacyRaw)}catch{return {status:"corrupt",sessions:[]}}
    if(!Array.isArray(legacy))return {status:"corrupt",sessions:[]};
    const migrated=legacy.flatMap((item:unknown):StoredSession[]=>{if(!item||typeof item!=="object")return [];const value=item as Record<string,unknown>;const endedAt=typeof value.endedAt==="string"?value.endedAt:typeof value.endTime==="string"?value.endTime:new Date().toISOString();const startedAt=typeof value.startedAt==="string"?value.startedAt:typeof value.startTime==="string"?value.startTime:endedAt;const interval=typeof value.intervalMinutes==="number"?value.intervalMinutes:30;return [{version:3,id:typeof value.id==="string"?value.id:createId(),worker:String(value.worker??value.name??"Unknown worker"),site:String(value.site??value.location??"Unspecified site"),task:String(value.task??"Not recorded"),safetyNotes:"",emergencyName:String(value.emergencyName??""),emergencyPhone:String(value.emergencyPhone??""),emergencyContactConfirmed:false,intervalMinutes:interval,expectedDurationMinutes:interval,startedAt,expectedEndAt:new Date(Date.parse(startedAt)+interval*60_000).toISOString(),deadlineAt:typeof value.deadlineAt==="string"?value.deadlineAt:endedAt,phase:"active",checkIns:Array.isArray(value.checkIns)?value.checkIns as CheckIn[]:[],missedCheckIns:0,notificationPermission:"unknown",endedAt,outcome:"completed"}];}).slice(0,50);
    if(migrated.length)localStorage.setItem(SESSION_HISTORY_KEY,JSON.stringify(migrated));
    return {status:migrated.length===legacy.length?(migrated.length?"ok":"empty"):"corrupt",sessions:migrated};
  } catch { return {status:"unavailable",sessions:[]}; }
}
export function readSessionHistory():StoredSession[] { return readSessionHistoryResult().sessions; }
export function deleteStoredSession(id:string):boolean { try { const result=readSessionHistoryResult(); if(result.status==="unavailable")return false; localStorage.setItem(SESSION_HISTORY_KEY,JSON.stringify(result.sessions.filter(session=>session.id!==id))); return true; } catch { return false; } }export function createId():string { return globalThis.crypto?.randomUUID?.()||`ss-${Date.now()}-${Math.random().toString(16).slice(2)}`; }