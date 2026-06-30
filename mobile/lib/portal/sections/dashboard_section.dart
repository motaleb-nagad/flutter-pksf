import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../app/widgets.dart';
import '../../domain/dashboard.dart';
import '../../domain/format.dart';
import '../../domain/models.dart';
import '../../state/app_state.dart';
import '../../theme/tokens.dart';

class DashboardSection extends StatelessWidget {
  const DashboardSection({super.key});

  @override
  Widget build(BuildContext context) {
    final all = context.watch<AppState>().beneficiaries;
    final highRows = all.where((b) => b.risk != RiskLevel.low).toList();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.45,
          children: [for (final k in kKpis) _kpiCard(k)],
        ),
        const SizedBox(height: 14),
        _panel(
          title: 'ANC 4+ coverage trend',
          subtitle: 'monthly % · গত ৬ মাস',
          child: _BarChart(points: kAncTrend),
        ),
        const SizedBox(height: 14),
        _panel(
          title: 'Risk distribution',
          subtitle: 'active pregnancies',
          child: Column(children: [for (final r in kRiskDistribution) _ProgressRow(r)]),
        ),
        const SizedBox(height: 14),
        _panel(
          title: 'Immunisation coverage by antigen',
          subtitle: 'EPI schedule · %',
          child: _BarChart(points: kAntigens),
        ),
        const SizedBox(height: 14),
        _panel(
          title: 'Nutrition status',
          subtitle: 'children under 5 · MUAC',
          child: _NutritionBands(bands: kNutritionBands),
        ),
        const SizedBox(height: 14),
        _panel(
          title: 'High-risk cases needing follow-up',
          subtitle: '',
          child: Column(children: [for (final h in highRows) _highRow(h)]),
        ),
      ],
    );
  }

  Widget _kpiCard(Kpi k) => AppCard(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(k.en, style: const TextStyle(fontSize: 12, color: T.text2)),
            Text(k.bn, style: const TextStyle(fontSize: 11, color: T.textMuted)),
            const SizedBox(height: 6),
            Text(k.value, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w700)),
            const SizedBox(height: 2),
            Text(k.sub, style: const TextStyle(fontSize: 11.5, color: Color(0xFF8A867C))),
          ],
        ),
      );

  Widget _panel({required String title, required String subtitle, required Widget child}) => AppCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            if (subtitle.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 2, bottom: 14),
                child: Text(subtitle, style: const TextStyle(fontSize: 11.5, color: T.textMuted)),
              )
            else
              const SizedBox(height: 12),
            child,
          ],
        ),
      );

  Widget _highRow(Beneficiary h) {
    final t = typeLine(h);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 9),
      child: Row(
        children: [
          Avatar(name: h.name, level: h.risk, size: 30),
          const SizedBox(width: 9),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(h.name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                Text('${t.en} · ${h.village}', style: const TextStyle(fontSize: 11.5, color: T.text2)),
                if (h.reason != null)
                  Text(h.reason!, style: const TextStyle(fontSize: 11, color: T.textMuted)),
              ],
            ),
          ),
          RiskBadge(level: h.risk),
        ],
      ),
    );
  }
}

/// A simple vertical bar chart built from plain widgets (no chart dependency).
class _BarChart extends StatelessWidget {
  const _BarChart({required this.points});
  final List<ChartPoint> points;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 150,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          for (final p in points)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text('${p.value}',
                        style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: p.color)),
                    const SizedBox(height: 4),
                    // Bar height is proportional to the value (0–100 scale → 0–110px).
                    Container(
                      height: p.value * 1.1,
                      decoration: BoxDecoration(
                        color: p.color,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(p.label, style: const TextStyle(fontSize: 10, color: T.textMuted)),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ProgressRow extends StatelessWidget {
  const _ProgressRow(this.point);
  final ChartPoint point;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(point.label, style: const TextStyle(fontSize: 12.5)),
              Text('${point.value}%',
                  style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: point.color)),
            ],
          ),
          const SizedBox(height: 5),
          ClipRRect(
            borderRadius: BorderRadius.circular(5),
            child: LinearProgressIndicator(
              value: point.value / 100,
              minHeight: 9,
              backgroundColor: const Color(0xFFEFEBE2),
              valueColor: AlwaysStoppedAnimation<Color>(point.color),
            ),
          ),
        ],
      ),
    );
  }
}

class _NutritionBands extends StatelessWidget {
  const _NutritionBands({required this.bands});
  final List<ChartPoint> bands;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(7),
          child: Row(
            children: [
              for (final n in bands)
                Expanded(flex: n.value, child: Container(height: 22, color: n.color)),
            ],
          ),
        ),
        const SizedBox(height: 14),
        for (final n in bands)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                Container(
                  width: 11,
                  height: 11,
                  decoration: BoxDecoration(color: n.color, borderRadius: BorderRadius.circular(3)),
                ),
                const SizedBox(width: 8),
                Expanded(child: Text(n.label, style: const TextStyle(fontSize: 12.5))),
                Text('${n.value}%', style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
      ],
    );
  }
}
