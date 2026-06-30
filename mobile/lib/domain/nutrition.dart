/// Child nutrition classification by MUAC (mid-upper-arm circumference) + oedema.
/// MUAC < 11.5 cm or bilateral pitting oedema = SAM; < 12.5 cm = MAM; else Normal.
import 'package:flutter/material.dart';

class NutritionStatus {
  const NutritionStatus({
    required this.short,
    required this.label,
    required this.bn,
    required this.action,
    required this.color,
    required this.bg,
  });

  final String short; // SAM | MAM | Normal
  final String label;
  final String bn;
  final String action;
  final Color color;
  final Color bg;
}

NutritionStatus classifyMuac(double cm, bool edema) {
  if (edema || cm < 11.5) {
    return const NutritionStatus(
      short: 'SAM',
      label: 'Severe Acute Malnutrition (SAM)',
      bn: 'তীব্র অপুষ্টি',
      action: 'Refer to nutrition centre today',
      color: Color(0xFFC0492E),
      bg: Color(0xFFF7E4DE),
    );
  }
  if (cm < 12.5) {
    return const NutritionStatus(
      short: 'MAM',
      label: 'Moderate Acute Malnutrition (MAM)',
      bn: 'মাঝারি অপুষ্টি',
      action: 'Enrol in supplementary feeding',
      color: Color(0xFFB5792A),
      bg: Color(0xFFF5EAD6),
    );
  }
  return const NutritionStatus(
    short: 'Normal',
    label: 'Normal nutrition status',
    bn: 'স্বাভাবিক',
    action: 'Continue growth monitoring',
    color: Color(0xFF0E7C66),
    bg: Color(0xFFE0EFEA),
  );
}
