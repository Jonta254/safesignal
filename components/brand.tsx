import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import styles from "./brand.module.css";
export function Brand({compact=false}:{compact?:boolean}){return <Link className={styles.brand} href="/" aria-label="SafeSignal home"><span className={styles.mark}><ShieldCheck size={compact?18:21}/></span><span>Safe<strong>Signal</strong></span></Link>}
