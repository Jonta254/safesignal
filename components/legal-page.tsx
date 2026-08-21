import type {ReactNode} from "react";
import Link from "next/link";
import {Brand} from "./brand";
import {SiteFooter} from "./site-footer";
import styles from "./legal-page.module.css";
export function LegalPage({eyebrow,title,intro,updated,children}:{eyebrow:string;title:string;intro:string;updated:string;children:ReactNode}){return <div className={styles.page}><a className={styles.skip} href="#main-content">Skip to content</a><header className={styles.header}><Brand/><Link href="/">Return home</Link></header><main id="main-content" className={styles.main}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.intro}>{intro}</p><p className={styles.updated}>Last updated: {updated}</p><article>{children}</article></main><SiteFooter/></div>}