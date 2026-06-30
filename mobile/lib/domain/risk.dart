/// Centralized risk classification. Every surface (field app + portal) reads
/// from here so colours and thresholds never drift — ported from the original
/// `risk.ts` and kept in lock-step with the backend's RiskService.
import 'package:flutter/material.dart';

import 'models.dart';

class RiskStyle {
  const RiskStyle(this.color, this.bg, this.label, this.bn);
  final Color color;
  final Color bg;
  final String label;
  final String bn;
}

const Map<RiskLevel, RiskStyle> kRisk = {
  RiskLevel.high: RiskStyle(Color(0xFFC0492E), Color(0xFFF7E4DE), 'High risk', 'উচ্চ ঝুঁকি'),
  RiskLevel.medium: RiskStyle(Color(0xFFB5792A), Color(0xFFF5EAD6), 'Medium risk', 'মাঝারি ঝুঁকি'),
  RiskLevel.low: RiskStyle(Color(0xFF0E7C66), Color(0xFFE0EFEA), 'Low risk', 'কম ঝুঁকি'),
};

RiskStyle riskStyle(RiskLevel level) => kRisk[level]!;

class ComputedRisk {
  ComputedRisk(this.level, this.reasons) : style = riskStyle(level);
  final RiskLevel level;
  final List<String> reasons;
  final RiskStyle style;

  Color get color => style.color;
  Color get bg => style.bg;
  String get label => style.label;
  String get bn => style.bn;
}

const Map<String, String> _dangerLabels = {
  'headache': 'Severe headache',
  'blurred': 'Blurred vision',
  'swelling': 'Swelling of face / hands',
  'bleeding': 'Vaginal bleeding',
  'convulsions': 'Convulsions',
  'fever': 'High fever',
  'fetal': 'Reduced fetal movement',
  'abdo': 'Severe abdominal pain',
  'breathing': 'Difficult breathing',
};

String _trim(double v) => v == v.roundToDouble() ? v.toInt().toString() : v.toString();

/// Auto-classify an ANC visit from vitals + danger signs.
/// Any danger sign → high. BP / Hb / FHR thresholds bump the level.
ComputedRisk computeAncRisk(AncVisit v) {
  final reasons = <String>[];
  var level = RiskLevel.low;
  void bump(RiskLevel l) => level = RiskLevel.max(level, l);

  final flags = <String, bool>{
    'headache': v.danger.headache,
    'blurred': v.danger.blurred,
    'swelling': v.danger.swelling,
    'bleeding': v.danger.bleeding,
    'convulsions': v.danger.convulsions,
    'fever': v.danger.fever,
    'fetal': v.danger.fetal,
    'abdo': v.danger.abdo,
    'breathing': v.danger.breathing,
  };
  flags.forEach((key, on) {
    if (on) {
      reasons.add(_dangerLabels[key]!);
      bump(RiskLevel.high);
    }
  });

  if (v.sbp >= 140 || v.dbp >= 90) {
    reasons.add('Raised BP ${v.sbp}/${v.dbp} mmHg (pre-eclampsia risk)');
    bump(RiskLevel.high);
  } else if (v.sbp >= 130 || v.dbp >= 85) {
    reasons.add('Borderline BP ${v.sbp}/${v.dbp}');
    bump(RiskLevel.medium);
  }

  if (v.hb < 7) {
    reasons.add('Severe anaemia · Hb ${_trim(v.hb)} g/dL');
    bump(RiskLevel.high);
  } else if (v.hb < 11) {
    reasons.add('Anaemia · Hb ${_trim(v.hb)} g/dL');
    bump(RiskLevel.medium);
  }

  if (v.fhr < 120 || v.fhr > 160) {
    reasons.add('Abnormal fetal heart rate ${v.fhr} bpm');
    bump(RiskLevel.high);
  }

  return ComputedRisk(level, reasons);
}
