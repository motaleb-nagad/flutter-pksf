/** Domain types for the MCH surveillance system. */

export type RiskLevel = 'high' | 'medium' | 'low';

export type BeneficiaryType =
  | 'anc' // pregnant / antenatal
  | 'pnc' // postnatal
  | 'child'
  | 'adolescent'
  | 'elderly'
  | 'disabled';

/** A bilingual label — English with a Bangla (বাংলা) secondary string. */
export interface Bilingual {
  en: string;
  bn: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bn: string; // Bangla name
  type: BeneficiaryType;
  village: string;
  code: string; // human ID, e.g. ANC-2451
  risk: RiskLevel;
  reason?: string;
  next: string; // next visit label, e.g. "Due today" / "10 Jul"
  age?: number;
  months?: number; // for children
  weeks?: number; // ANC gestational weeks
  anc?: number; // ANC contact count
  edd?: string; // expected date of delivery
  day?: number; // PNC day
  muac?: number; // child MUAC (cm)
}

export type WorkerRole = 'FWA' | 'FWV' | 'CHCP' | 'HA';
export type OnlineStatus = 'online' | 'offline';

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  union: string;
  assigned: number;
  high: number;
  visits: number;
  cov: number; // ANC4+ coverage %
  lastSync: string;
  status: OnlineStatus;
}

/** Antenatal visit vitals + danger signs (drives automatic risk classification). */
export interface DangerSigns {
  headache: boolean;
  blurred: boolean;
  swelling: boolean;
  bleeding: boolean;
  convulsions: boolean;
  fever: boolean;
  fetal: boolean; // reduced fetal movement
  abdo: boolean; // abdominal pain
  breathing: boolean;
}

export interface AncVisit {
  sbp: number;
  dbp: number;
  weight: number;
  hb: number;
  fundal: number;
  fhr: number;
  note: string;
  danger: DangerSigns;
}

export interface AncServices {
  ifa: boolean;
  tt: boolean;
  calcium: boolean;
}

export interface ChildAssessment {
  muac: number;
  weight: number;
  length: number;
  edema: boolean;
}

/** A record queued for sync while the device is offline. */
export interface SyncQueueItem {
  id?: number;
  kind: 'visit' | 'registration' | 'child-assessment' | 'worker';
  refId: string;
  label: string;
  createdAt: number;
}
