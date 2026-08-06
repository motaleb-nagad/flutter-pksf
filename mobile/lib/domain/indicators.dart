/// WHO & Bangladesh MCH framework indicator readouts for the supervisor portal.
/// Each item is a coverage metric (higher = better) or a burden metric
/// (higher = worse) — covColor() handles the inverted scale.
import 'package:flutter/material.dart';

import 'format.dart';

class IndicatorItem {
  IndicatorItem(this.name, this.bn, this.value, this.burden)
      : valueLabel = '$value%',
        color = covColor(value, burden: burden);
  final String name;
  final String bn;
  final int value;
  final String valueLabel;
  final bool burden;
  final Color color;
}

class IndicatorGroup {
  IndicatorGroup(this.group, this.bn, this.items);
  final String group;
  final String bn;
  final List<IndicatorItem> items;
}

class _Raw {
  const _Raw(this.name, this.bn, this.value, [this.burden = false]);
  final String name;
  final String bn;
  final int value;
  final bool burden;
}

const List<(String, String, List<_Raw>)> _raw = [
  (
    'Antenatal Care',
    'গর্ভকালীন সেবা',
    [
      _Raw('ANC 1st contact (1st trimester)', '১ম ত্রৈমাসিকে নিবন্ধন', 68),
      _Raw('ANC 4+ contacts', '৪+ পরিদর্শন', 71),
      _Raw('ANC 8 contacts (WHO 2016)', '৮টি পরিদর্শন', 22),
      _Raw('TT / Td immunisation (2+ doses)', 'টিটি টিকা', 89),
      _Raw('IFA supplementation (180+ tabs)', 'আয়রন-ফলিক', 64),
      _Raw('Calcium supplementation', 'ক্যালসিয়াম', 41),
      _Raw('Blood pressure measured', 'রক্তচাপ পরিমাপ', 93),
      _Raw('Anaemia / Hb screening', 'রক্তস্বল্পতা পরীক্ষা', 77),
      _Raw('Syphilis tested', 'সিফিলিস পরীক্ষা', 58),
      _Raw('Ultrasound before 24 wk', 'আল্ট্রাসনোগ্রাম', 39),
      _Raw('Birth & complication plan', 'প্রসব পরিকল্পনা', 61),
    ]
  ),
  (
    'Delivery & Birth',
    'প্রসব ও জন্ম',
    [
      _Raw('Skilled birth attendant', 'দক্ষ ধাত্রী', 63),
      _Raw('Facility delivery', 'প্রতিষ্ঠানে প্রসব', 57),
      _Raw('Early breastfeeding (<1 hr)', 'দ্রুত বুকের দুধ', 66),
      _Raw('Chlorhexidine cord care', 'নাড়ি পরিচর্যা', 72),
      _Raw('KMC for LBW / preterm', 'ক্যাঙ্গারু কেয়ার', 34),
      _Raw('Low birth weight (<2.5 kg)', 'কম ওজনে জন্ম', 18, true),
      _Raw('Caesarean section rate', 'সিজার', 28, true),
    ]
  ),
  (
    'Postnatal Care',
    'প্রসব-পরবর্তী সেবা',
    [
      _Raw('PNC mother within 48 hr', 'মায়ের পিএনসি', 58),
      _Raw('PNC newborn within 48 hr', 'নবজাতকের পিএনসি', 55),
      _Raw('PNC 4 visits complete', '৪টি পিএনসি', 31),
      _Raw('Family planning counselling', 'পরিবার পরিকল্পনা পরামর্শ', 49),
    ]
  ),
  (
    'Immunisation (EPI)',
    'টিকাদান',
    [
      _Raw('BCG', 'বিসিজি', 97),
      _Raw('Pentavalent 3', 'পেন্টা-৩', 88),
      _Raw('PCV 3', 'পিসিভি-৩', 86),
      _Raw('OPV 3', 'ওপিভি-৩', 87),
      _Raw('IPV', 'আইপিভি', 79),
      _Raw('MR 1', 'এমআর-১', 85),
      _Raw('MR 2', 'এমআর-২', 72),
      _Raw('Fully immunised by 1 yr', 'সম্পূর্ণ টিকা', 84),
    ]
  ),
  (
    'Child Growth & Nutrition',
    'শিশু পুষ্টি',
    [
      _Raw('Monthly growth monitoring', 'বৃদ্ধি পর্যবেক্ষণ', 67),
      _Raw('Exclusive breastfeeding <6 mo', 'একচেটিয়া বুকের দুধ', 65),
      _Raw('Minimum acceptable diet', 'গ্রহণযোগ্য খাদ্য', 34),
      _Raw('Vitamin A (6–59 mo)', 'ভিটামিন এ', 88),
      _Raw('Deworming', 'কৃমিনাশক', 81),
      _Raw('Stunting (HAZ < −2)', 'খর্বকায়', 28, true),
      _Raw('Wasting (WHZ < −2)', 'কৃশকায়', 9, true),
      _Raw('Underweight (WAZ < −2)', 'কম ওজন', 22, true),
    ]
  ),
  (
    'Family Planning',
    'পরিবার পরিকল্পনা',
    [
      _Raw('Modern method use', 'আধুনিক পদ্ধতি', 54),
      _Raw('Postpartum family planning', 'প্রসব-পরবর্তী', 38),
      _Raw('Unmet need', 'অপূর্ণ চাহিদা', 12, true),
    ]
  ),
];

List<IndicatorGroup> indicatorGroups() => _raw
    .map((g) => IndicatorGroup(
          g.$1,
          g.$2,
          g.$3.map((it) => IndicatorItem(it.name, it.bn, it.value, it.burden)).toList(),
        ))
    .toList();
