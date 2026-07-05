/// Initials, bilingual type lines, the coverage/burden colour scale, and the
/// field-officer username/password generators. Ported from `format.ts`.
import 'dart:math';

import 'package:flutter/material.dart';

import 'models.dart';

/// First-two initials from a name, e.g. "Rahima Begum" → "RB".
String initials(String name) {
  final words = name.trim().split(RegExp(r'\s+'));
  final buf = StringBuffer();
  for (final w in words) {
    if (buf.length >= 2) break;
    if (w.isNotEmpty) buf.write(w[0].toUpperCase());
  }
  return buf.toString();
}

/// Bilingual one-liner describing a beneficiary's type + key attribute.
Bilingual typeLine(Beneficiary b) {
  switch (b.type) {
    case BeneficiaryType.anc:
      return Bilingual('Pregnant · ${b.weeks} wk', 'গর্ভবতী মা');
    case BeneficiaryType.pnc:
      return Bilingual('Postnatal · Day ${b.day}', 'প্রসব-পরবর্তী');
    case BeneficiaryType.adolescent:
      return Bilingual('Adolescent · ${b.age} yr', 'কিশোর-কিশোরী');
    case BeneficiaryType.elderly:
      return Bilingual('Elderly · ${b.age} yr', 'প্রবীণ');
    case BeneficiaryType.disabled:
      return const Bilingual('Person with disability', 'প্রতিবন্ধী');
    case BeneficiaryType.child:
      return Bilingual('Child · ${b.months} mo', 'শিশু');
  }
}

/// Coverage / prevalence colour. For coverage indicators higher is better; for
/// "burden" indicators (wasting, caesarean rate, unmet need) the scale inverts.
Color covColor(int v, {bool burden = false}) {
  if (burden) {
    return v >= 25
        ? const Color(0xFFC0492E)
        : v >= 12
            ? const Color(0xFFB5792A)
            : const Color(0xFF03803D);
  }
  return v >= 85
      ? const Color(0xFF03803D)
      : v >= 60
          ? const Color(0xFFB5792A)
          : const Color(0xFFC0492E);
}

String unionCode(String u) =>
    u.trim().split(RegExp(r'\s+')).where((w) => w.isNotEmpty).map((w) => w[0].toLowerCase()).join();

String genUsername(String name, String union, int n) {
  final parts = name.trim().split(RegExp(r'\s+'));
  final first = (parts.isNotEmpty ? parts[0] : 'worker')
      .toLowerCase()
      .replaceAll(RegExp(r'[^a-z]'), '');
  final base = first.isEmpty ? 'worker' : first;
  return '$base.${unionCode(union)}${n.toString().padLeft(2, '0')}';
}

final _rand = Random.secure();

String genPassword() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  final buf = StringBuffer('Mch-');
  for (var i = 0; i < 4; i++) {
    buf.write(c[_rand.nextInt(c.length)]);
  }
  return buf.toString();
}
