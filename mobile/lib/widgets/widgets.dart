/// Shared UI primitives (Avatar, RiskBadge, AppCard, SectionLabel, ScreenHeader)
/// used across the field app and the portal.
import 'package:flutter/material.dart';

import '../domain/format.dart';
import '../domain/models.dart';
import '../domain/risk.dart';
import '../theme/tokens.dart';

/// A round avatar showing a person's initials, tinted by their risk level.
class Avatar extends StatelessWidget {
  const Avatar({super.key, required this.name, required this.level, this.size = 40});

  final String name;
  final RiskLevel level;
  final double size;

  @override
  Widget build(BuildContext context) {
    final style = riskStyle(level);
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: style.bg, shape: BoxShape.circle),
      child: Text(
        initials(name),
        style: TextStyle(color: style.color, fontWeight: FontWeight.w700, fontSize: size * 0.32),
      ),
    );
  }
}

enum RiskBadgeVariant { soft, solid }

class RiskBadge extends StatelessWidget {
  const RiskBadge({
    super.key,
    required this.level,
    this.text = 'en',
    this.variant = RiskBadgeVariant.soft,
  });

  final RiskLevel level;
  final String text; // 'en' | 'bn'
  final RiskBadgeVariant variant;

  @override
  Widget build(BuildContext context) {
    final style = riskStyle(level);
    final solid = variant == RiskBadgeVariant.solid;
    final label = text == 'bn' ? style.bn : style.label;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: solid ? Colors.white.withOpacity(0.18) : style.bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: solid ? Colors.white : style.color,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

/// White rounded card with a hairline border (and optional left risk accent).
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(13),
    this.onTap,
    this.leftAccent,
    this.margin,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final Color? leftAccent;
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    // A uniform border is required when a borderRadius is set, so the optional
    // left risk accent is drawn as a clipped strip inside the rounded card
    // rather than as a thicker left BorderSide.
    final content = Padding(padding: padding, child: child);
    final card = Container(
      margin: margin,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: T.card,
        borderRadius: BorderRadius.circular(13),
        border: Border.all(color: T.border2),
      ),
      child: leftAccent == null
          ? content
          : IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(width: 4, color: leftAccent),
                  Expanded(child: content),
                ],
              ),
            ),
    );
    if (onTap == null) return card;
    return InkWell(borderRadius: BorderRadius.circular(13), onTap: onTap, child: card);
  }
}

class SectionLabel extends StatelessWidget {
  const SectionLabel(this.text, {super.key, this.color = T.text2, this.margin});
  final String text;
  final Color color;
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: margin ?? const EdgeInsets.only(bottom: 10),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11.5,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.3,
          color: color,
        ),
      ),
    );
  }
}

/// Green app screen header with a back chevron + bilingual title.
class ScreenHeader extends StatelessWidget {
  const ScreenHeader({
    super.key,
    required this.title,
    this.subtitle,
    required this.onBack,
    this.trailing,
  });

  final String title;
  final String? subtitle;
  final VoidCallback onBack;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: T.brand,
      padding: const EdgeInsets.fromLTRB(8, 14, 16, 14),
      child: SafeArea(
        bottom: false,
        child: Row(
          children: [
            IconButton(
              onPressed: onBack,
              icon: const Icon(Icons.chevron_left, color: Colors.white, size: 26),
              tooltip: 'Back',
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15.5)),
                  if (subtitle != null)
                    Text(subtitle!,
                        style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 11.5)),
                ],
              ),
            ),
            if (trailing != null) trailing!,
          ],
        ),
      ),
    );
  }
}

/// Full-width brand-coloured primary button used on save/continue actions.
class PrimaryButton extends StatelessWidget {
  const PrimaryButton({super.key, required this.label, required this.onPressed, this.color = T.brand});
  final String label;
  final VoidCallback? onPressed;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 15),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
        ),
        child: Text(label),
      ),
    );
  }
}
