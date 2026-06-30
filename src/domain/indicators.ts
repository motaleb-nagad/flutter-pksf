/*
 * WHO & Bangladesh MCH framework indicator readouts for the supervisor portal.
 * Each item is either a "coverage" metric (higher = better) or a "burden"
 * metric (higher = worse) — covColor() handles the inverted scale.
 */
import { covColor } from './format';

export interface IndicatorItem {
  name: string;
  bn: string;
  value: number;
  valueLabel: string;
  burden: boolean;
  color: string;
}

export interface IndicatorGroup {
  group: string;
  bn: string;
  items: IndicatorItem[];
}

type RawItem = [name: string, bn: string, value: number, burden?: 'burden'];

const RAW: { group: string; bn: string; items: RawItem[] }[] = [
  {
    group: 'Antenatal Care',
    bn: 'গর্ভকালীন সেবা',
    items: [
      ['ANC 1st contact (1st trimester)', '১ম ত্রৈমাসিকে নিবন্ধন', 68],
      ['ANC 4+ contacts', '৪+ পরিদর্শন', 71],
      ['ANC 8 contacts (WHO 2016)', '৮টি পরিদর্শন', 22],
      ['TT / Td immunisation (2+ doses)', 'টিটি টিকা', 89],
      ['IFA supplementation (180+ tabs)', 'আয়রন-ফলিক', 64],
      ['Calcium supplementation', 'ক্যালসিয়াম', 41],
      ['Blood pressure measured', 'রক্তচাপ পরিমাপ', 93],
      ['Anaemia / Hb screening', 'রক্তস্বল্পতা পরীক্ষা', 77],
      ['Syphilis tested', 'সিফিলিস পরীক্ষা', 58],
      ['Ultrasound before 24 wk', 'আল্ট্রাসনোগ্রাম', 39],
      ['Birth & complication plan', 'প্রসব পরিকল্পনা', 61],
    ],
  },
  {
    group: 'Delivery & Birth',
    bn: 'প্রসব ও জন্ম',
    items: [
      ['Skilled birth attendant', 'দক্ষ ধাত্রী', 63],
      ['Facility delivery', 'প্রতিষ্ঠানে প্রসব', 57],
      ['Early breastfeeding (<1 hr)', 'দ্রুত বুকের দুধ', 66],
      ['Chlorhexidine cord care', 'নাড়ি পরিচর্যা', 72],
      ['KMC for LBW / preterm', 'ক্যাঙ্গারু কেয়ার', 34],
      ['Low birth weight (<2.5 kg)', 'কম ওজনে জন্ম', 18, 'burden'],
      ['Caesarean section rate', 'সিজার', 28, 'burden'],
    ],
  },
  {
    group: 'Postnatal Care',
    bn: 'প্রসব-পরবর্তী সেবা',
    items: [
      ['PNC mother within 48 hr', 'মায়ের পিএনসি', 58],
      ['PNC newborn within 48 hr', 'নবজাতকের পিএনসি', 55],
      ['PNC 4 visits complete', '৪টি পিএনসি', 31],
      ['Family planning counselling', 'পরিবার পরিকল্পনা পরামর্শ', 49],
    ],
  },
  {
    group: 'Immunisation (EPI)',
    bn: 'টিকাদান',
    items: [
      ['BCG', 'বিসিজি', 97],
      ['Pentavalent 3', 'পেন্টা-৩', 88],
      ['PCV 3', 'পিসিভি-৩', 86],
      ['OPV 3', 'ওপিভি-৩', 87],
      ['IPV', 'আইপিভি', 79],
      ['MR 1', 'এমআর-১', 85],
      ['MR 2', 'এমআর-২', 72],
      ['Fully immunised by 1 yr', 'সম্পূর্ণ টিকা', 84],
    ],
  },
  {
    group: 'Child Growth & Nutrition',
    bn: 'শিশু পুষ্টি',
    items: [
      ['Monthly growth monitoring', 'বৃদ্ধি পর্যবেক্ষণ', 67],
      ['Exclusive breastfeeding <6 mo', 'একচেটিয়া বুকের দুধ', 65],
      ['Minimum acceptable diet', 'গ্রহণযোগ্য খাদ্য', 34],
      ['Vitamin A (6–59 mo)', 'ভিটামিন এ', 88],
      ['Deworming', 'কৃমিনাশক', 81],
      ['Stunting (HAZ < −2)', 'খর্বকায়', 28, 'burden'],
      ['Wasting (WHZ < −2)', 'কৃশকায়', 9, 'burden'],
      ['Underweight (WAZ < −2)', 'কম ওজন', 22, 'burden'],
    ],
  },
  {
    group: 'Family Planning',
    bn: 'পরিবার পরিকল্পনা',
    items: [
      ['Modern method use', 'আধুনিক পদ্ধতি', 54],
      ['Postpartum family planning', 'প্রসব-পরবর্তী', 38],
      ['Unmet need', 'অপূর্ণ চাহিদা', 12, 'burden'],
    ],
  },
];

export function indicatorGroups(): IndicatorGroup[] {
  return RAW.map((g) => ({
    group: g.group,
    bn: g.bn,
    items: g.items.map((it) => {
      const burden = it[3] === 'burden';
      return {
        name: it[0],
        bn: it[1],
        value: it[2],
        valueLabel: `${it[2]}%`,
        burden,
        color: covColor(it[2], burden),
      };
    }),
  }));
}
