import 'package:flutter/material.dart';

import '../widgets/widgets.dart';
import '../domain/indicators.dart';
import '../theme/tokens.dart';

class IndicatorsSection extends StatelessWidget {
  const IndicatorsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final groups = indicatorGroups();
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Wrap(
          spacing: 16,
          runSpacing: 8,
          children: const [
            _LegendDot(Color(0xFF03803D), '≥ 85% on target'),
            _LegendDot(Color(0xFFB5792A), '60–84% gap'),
            _LegendDot(Color(0xFFC0492E), '< 60% / high burden'),
          ],
        ),
        const SizedBox(height: 16),
        for (final g in groups)
          AppCard(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(g.group, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
                Padding(
                  padding: const EdgeInsets.only(top: 2, bottom: 13),
                  child: Text(g.bn, style: const TextStyle(fontSize: 11, color: T.textMuted)),
                ),
                for (final i in g.items)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 11),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Text(i.name, style: const TextStyle(fontSize: 12, color: T.textSoft)),
                            ),
                            Text(i.valueLabel,
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: i.color)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: i.value / 100,
                            minHeight: 7,
                            backgroundColor: const Color(0xFFEFEBE2),
                            valueColor: AlwaysStoppedAnimation<Color>(i.color),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}

class _LegendDot extends StatelessWidget {
  const _LegendDot(this.color, this.label);
  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 11,
          height: 11,
          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3)),
        ),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12, color: T.text2)),
      ],
    );
  }
}
