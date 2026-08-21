import Image from "next/image";
import Link from "next/link";
import styles from "./brand.module.css";
export function Brand({compact=false}:{compact?:boolean}){return <Link className={styles.brand} href="/" aria-label="SafeSignal home"><span className={styles.mark}><Image src="/icon.svg" width={compact?18:21} height={compact?18:21} alt="" aria-hidden="true" unoptimized/></span><span>Safe<strong>Signal</strong></span></Link>}