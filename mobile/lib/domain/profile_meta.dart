/// Care-checklist metadata for non-ANC/child beneficiary profiles
/// (adolescent / elderly / disability). Ported from `profileMeta.ts`.
import 'package:flutter/material.dart';

import 'models.dart';

class CareItem {
  const CareItem(this.label, this.statusLabel, this.color, this.mark);
  final String label;
  final String statusLabel;
  final Color color;
  final String mark; // ✓ or !
}

class GeneralProfileMeta {
  const GeneralProfileMeta(this.title, this.bn, this.items);
  final String title;
  final String bn;
  final List<CareItem> items;
}

const _green = Color(0xFF0E7C66);
const _amber = Color(0xFFC68A3E);
const _red = Color(0xFFC0492E);

const Map<BeneficiaryType, GeneralProfileMeta> _meta = {
  BeneficiaryType.adolescent: GeneralProfileMeta('Adolescent health', 'কিশোর-কিশোরী স্বাস্থ্য', [
    CareItem('Iron-folic acid (weekly)', 'On track', _green, '✓'),
    CareItem('Nutrition & BMI screening', 'Due today', _amber, '!'),
    CareItem('Menstrual health counselling', 'Done', _green, '✓'),
    CareItem('Td immunisation', 'Pending', _amber, '!'),
  ]),
  BeneficiaryType.elderly: GeneralProfileMeta('Elderly care', 'প্রবীণ সেবা', [
    CareItem('Blood pressure check', 'High — refer', _red, '!'),
    CareItem('Blood glucose screening', 'Due today', _amber, '!'),
    CareItem('Vision & hearing', 'Done', _green, '✓'),
    CareItem('Mobility & fall-risk review', 'Pending', _amber, '!'),
  ]),
  BeneficiaryType.disabled: GeneralProfileMeta('Disability support', 'প্রতিবন্ধী সহায়তা', [
    CareItem('Functional assessment', 'Done', _green, '✓'),
    CareItem('Assistive device need', 'Wheelchair', _amber, '!'),
    CareItem('Caregiver support', 'Counselled', _green, '✓'),
    CareItem('Referral to rehab services', 'Pending', _amber, '!'),
  ]),
};

GeneralProfileMeta generalProfileMeta(BeneficiaryType type) =>
    _meta[type] ?? _meta[BeneficiaryType.adolescent]!;
