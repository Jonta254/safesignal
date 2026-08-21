export type ProductMode="local-preview"|"cloud-preview"|"monitored-production";
export type ProductCapabilities={mode:ProductMode;localSessions:true;cloudAccounts:boolean;supervisorSync:boolean;automaticEscalation:boolean;emergencyDispatch:false;continuousTracking:false};
const MODES=new Set<ProductMode>(["local-preview","cloud-preview","monitored-production"]);
export function resolveProductCapabilities(environment:Record<string,string|undefined>=process.env):ProductCapabilities{
 const requested=environment.SAFESIGNAL_PRODUCT_MODE;
 const mode:ProductMode=MODES.has(requested as ProductMode)?requested as ProductMode:"local-preview";
 const cloudConfigured=Boolean(environment.DATABASE_URL&&environment.AUTH_PROVIDER_SECRET);
 const notificationConfigured=Boolean(environment.NOTIFICATION_PROVIDER&&environment.NOTIFICATION_PROVIDER_SECRET&&environment.QUEUE_SIGNING_SECRET);
 if(mode==="monitored-production"&&(!cloudConfigured||!notificationConfigured))throw new Error("Monitored production mode requires database, authentication, queue, and notification configuration.");
 return {mode,localSessions:true,cloudAccounts:mode!=="local-preview"&&cloudConfigured,supervisorSync:mode!=="local-preview"&&cloudConfigured,automaticEscalation:mode==="monitored-production"&&notificationConfigured,emergencyDispatch:false,continuousTracking:false};
}
export function publicCapabilitySummary(capabilities:ProductCapabilities){return {mode:capabilities.mode,localSessions:capabilities.localSessions,cloudAccounts:capabilities.cloudAccounts,supervisorSync:capabilities.supervisorSync,automaticEscalation:capabilities.automaticEscalation,emergencyDispatch:false,continuousTracking:false}}