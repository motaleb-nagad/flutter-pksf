/// Design tokens — single source of truth for the MCH surveillance UI.
/// Values come straight from the original `tokens.css`.
import 'package:flutter/material.dart';

class T {
  // Brand / greens — matched to the PKSF app's green (#03803d)
  static const brand = Color(0xFF03803D); // primary actions, app headers
  static const brandDeep = Color(0xFF025C2C); // portal sidebar + portal login bg

  // Backgrounds
  static const pageBg = Color(0xFFECE7DD); // outer page (warm sand)
  static const appBg = Color(0xFFF7F5F0); // mobile app content
  static const portalBg = Color(0xFFF4F2EC); // portal main area
  static const portalHeaderBg = Color(0xFFFBFAF6); // portal top bar
  static const card = Color(0xFFFFFFFF);

  // Borders (warm grays)
  static const border1 = Color(0xFFECE7DD);
  static const border2 = Color(0xFFE9E5DB);
  static const border3 = Color(0xFFE3DFD4);
  static const border4 = Color(0xFFDCD7CC);
  static const divider = Color(0xFFF0ECE4);

  // Text
  static const text = Color(0xFF1E1C18);
  static const text2 = Color(0xFF6A665C);
  static const textMuted = Color(0xFF9A958B);
  static const textSoft = Color(0xFF3A372F);

  // Risk
  static const riskHigh = Color(0xFFC0492E);
  static const riskHighBg = Color(0xFFF7E4DE);
  static const riskMedium = Color(0xFFB5792A);
  static const riskMediumBg = Color(0xFFF5EAD6);
  static const riskLow = Color(0xFF03803D);
  static const riskLowBg = Color(0xFFE0EFEA);

  // Status / accents
  static const warningDot = Color(0xFFFFC24B); // offline / pending-sync indicator
  static const amber = Color(0xFFC68A3E); // "due/pending" checklist marks
}

ThemeData buildTheme() {
  final base = ThemeData(
    useMaterial3: true,
    colorSchemeSeed: T.brand,
    scaffoldBackgroundColor: T.appBg,
    fontFamily: 'Hind Siliguri',
  );
  return base.copyWith(
    textTheme: base.textTheme.apply(bodyColor: T.text, displayColor: T.text),
  );
}
