/// Aggregate programme figures for the supervisor dashboard.
import 'package:flutter/material.dart';

import 'format.dart';

class Kpi {
  const Kpi(this.en, this.bn, this.value, this.sub, this.good);
  final String en;
  final String bn;
  final String value;
  final String sub;
  final bool good;
}

class ChartPoint {
  ChartPoint(this.label, this.value, [Color? color]) : color = color ?? covColor(value);
  final String label;
  final int value;
  final Color color;
}

const List<Kpi> kKpis = [
  Kpi('Registered pregnancies', 'নিবন্ধিত গর্ভবতী', '1,284', '+96 this month', true),
  Kpi('ANC 4+ coverage', 'এএনসি ৪+', '71%', 'Target 90%', false),
  Kpi('Skilled birth attendance', 'দক্ষ ধাত্রী', '63%', '+4 pts vs Q1', true),
  Kpi('PNC within 48 hr', 'পিএনসি ৪৮ ঘণ্টা', '58%', 'Target 80%', false),
  Kpi('Fully immunised <1 yr', 'সম্পূর্ণ টিকা', '84%', '+2 pts', true),
  Kpi('Active SAM cases', 'সক্রিয় তীব্র অপুষ্টি', '37', '29 in treatment', false),
];

final List<ChartPoint> kAncTrend = [
  ChartPoint('Jan', 58, const Color(0xFF03803D)),
  ChartPoint('Feb', 61, const Color(0xFF03803D)),
  ChartPoint('Mar', 64, const Color(0xFF03803D)),
  ChartPoint('Apr', 66, const Color(0xFF03803D)),
  ChartPoint('May', 69, const Color(0xFF03803D)),
  ChartPoint('Jun', 71, const Color(0xFF03803D)),
];

final List<ChartPoint> kAntigens = [
  ChartPoint('BCG', 97),
  ChartPoint('Penta3', 88),
  ChartPoint('PCV3', 86),
  ChartPoint('OPV3', 87),
  ChartPoint('IPV', 79),
  ChartPoint('MR1', 85),
  ChartPoint('MR2', 72),
];

final List<ChartPoint> kNutritionBands = [
  ChartPoint('Normal', 81, const Color(0xFF03803D)),
  ChartPoint('MAM', 13, const Color(0xFFB5792A)),
  ChartPoint('SAM', 6, const Color(0xFFC0492E)),
];

final List<ChartPoint> kRiskDistribution = [
  ChartPoint('Low', 64, const Color(0xFF03803D)),
  ChartPoint('Medium', 26, const Color(0xFFB5792A)),
  ChartPoint('High', 10, const Color(0xFFC0492E)),
];
