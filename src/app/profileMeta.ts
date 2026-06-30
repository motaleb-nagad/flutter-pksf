import type { BeneficiaryType } from '../domain/types';

export interface CareItem {
  label: string;
  statusLabel: string;
  color: string;
  mark: string; // ✓ or !
}

export interface GeneralProfileMeta {
  title: string;
  bn: string;
  items: CareItem[];
}

const META: Partial<Record<BeneficiaryType, GeneralProfileMeta>> = {
  adolescent: {
    title: 'Adolescent health',
    bn: 'কিশোর-কিশোরী স্বাস্থ্য',
    items: [
      { label: 'Iron-folic acid (weekly)', statusLabel: 'On track', color: '#0E7C66', mark: '✓' },
      { label: 'Nutrition & BMI screening', statusLabel: 'Due today', color: '#C68A3E', mark: '!' },
      { label: 'Menstrual health counselling', statusLabel: 'Done', color: '#0E7C66', mark: '✓' },
      { label: 'Td immunisation', statusLabel: 'Pending', color: '#C68A3E', mark: '!' },
    ],
  },
  elderly: {
    title: 'Elderly care',
    bn: 'প্রবীণ সেবা',
    items: [
      { label: 'Blood pressure check', statusLabel: 'High — refer', color: '#C0492E', mark: '!' },
      { label: 'Blood glucose screening', statusLabel: 'Due today', color: '#C68A3E', mark: '!' },
      { label: 'Vision & hearing', statusLabel: 'Done', color: '#0E7C66', mark: '✓' },
      { label: 'Mobility & fall-risk review', statusLabel: 'Pending', color: '#C68A3E', mark: '!' },
    ],
  },
  disabled: {
    title: 'Disability support',
    bn: 'প্রতিবন্ধী সহায়তা',
    items: [
      { label: 'Functional assessment', statusLabel: 'Done', color: '#0E7C66', mark: '✓' },
      { label: 'Assistive device need', statusLabel: 'Wheelchair', color: '#C68A3E', mark: '!' },
      { label: 'Caregiver support', statusLabel: 'Counselled', color: '#0E7C66', mark: '✓' },
      { label: 'Referral to rehab services', statusLabel: 'Pending', color: '#C68A3E', mark: '!' },
    ],
  },
};

export function generalProfileMeta(type: BeneficiaryType): GeneralProfileMeta {
  return META[type] ?? META.adolescent!;
}
