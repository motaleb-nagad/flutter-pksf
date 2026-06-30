/*
 * Child nutrition classification by MUAC (mid-upper-arm circumference) + oedema.
 * MUAC < 11.5 cm or bilateral pitting oedema = SAM (severe acute malnutrition).
 */

export interface NutritionStatus {
  short: 'SAM' | 'MAM' | 'Normal';
  label: string;
  bn: string;
  action: string;
  color: string;
  bg: string;
}

export function classifyMuac(cm: number, edema: boolean): NutritionStatus {
  if (edema || cm < 11.5) {
    return {
      short: 'SAM',
      label: 'Severe Acute Malnutrition (SAM)',
      bn: 'তীব্র অপুষ্টি',
      action: 'Refer to nutrition centre today',
      color: '#C0492E',
      bg: '#F7E4DE',
    };
  }
  if (cm < 12.5) {
    return {
      short: 'MAM',
      label: 'Moderate Acute Malnutrition (MAM)',
      bn: 'মাঝারি অপুষ্টি',
      action: 'Enrol in supplementary feeding',
      color: '#B5792A',
      bg: '#F5EAD6',
    };
  }
  return {
    short: 'Normal',
    label: 'Normal nutrition status',
    bn: 'স্বাভাবিক',
    action: 'Continue growth monitoring',
    color: '#0E7C66',
    bg: '#E0EFEA',
  };
}
