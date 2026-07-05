import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../domain/format.dart';
import '../domain/models.dart';
import '../domain/nutrition.dart';
import '../domain/profile_meta.dart';
import '../domain/risk.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';
import '../widgets/widgets.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final b = state.selected;
    if (b == null) return const SizedBox.shrink();

    final isAnc = b.type == BeneficiaryType.anc || b.type == BeneficiaryType.pnc;
    final isChild = b.type == BeneficiaryType.child;

    return Column(
      children: [
        _ProfileHeader(b: b, onBack: () => state.setFilter(ListFilter.all)),
        Expanded(
          child: isAnc
              ? _AncProfile(b: b, onVisit: () => state.go(AppScreen.visit, AppTab.cases))
              : isChild
                  ? _ChildProfile(b: b, onRecord: () => state.go(AppScreen.child, AppTab.cases))
                  : _GeneralProfile(b: b, onRecord: () => state.setFilter(ListFilter.all)),
        ),
      ],
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  const _ProfileHeader({required this.b, required this.onBack});
  final Beneficiary b;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final t = typeLine(b);
    return Container(
      color: T.brand,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(8, 6, 16, 16),
          child: Column(
            children: [
              Row(
                children: [
                  IconButton(
                    onPressed: onBack,
                    icon: const Icon(Icons.chevron_left, color: Colors.white, size: 26),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(b.name,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16)),
                        Text('${b.bn} · ${t.en}',
                            style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 11.5)),
                      ],
                    ),
                  ),
                  RiskBadge(level: b.risk, variant: RiskBadgeVariant.solid),
                ],
              ),
              const SizedBox(height: 13),
              Row(
                children: [
                  _meta('ID', b.code),
                  const SizedBox(width: 18),
                  _meta('Village', b.village),
                  const SizedBox(width: 18),
                  _meta('Next visit', b.next),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _meta(String label, String value) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 10.5)),
          Text(value, style: TextStyle(color: Colors.white.withOpacity(0.92), fontSize: 12)),
        ],
      );
}

class _AncProfile extends StatelessWidget {
  const _AncProfile({required this.b, required this.onVisit});
  final Beneficiary b;
  final VoidCallback onVisit;

  @override
  Widget build(BuildContext context) {
    final ancCount = b.anc ?? 0;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppCard(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text.rich(TextSpan(children: [
                    TextSpan(text: 'ANC contacts ', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5)),
                    TextSpan(text: '· WHO target 8', style: TextStyle(color: T.textMuted, fontSize: 13.5)),
                  ])),
                  Text('$ancCount / 8',
                      style: const TextStyle(color: T.brand, fontWeight: FontWeight.w700, fontSize: 13)),
                ],
              ),
              const SizedBox(height: 11),
              Row(
                children: [
                  for (var n = 1; n <= 8; n++)
                    Expanded(
                      child: Container(
                        height: 28,
                        margin: EdgeInsets.only(right: n < 8 ? 6 : 0),
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: n <= ancCount ? T.brand : const Color(0xFFE5E1D8),
                          borderRadius: BorderRadius.circular(7),
                        ),
                        child: Text('$n',
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: n <= ancCount ? Colors.white : T.textMuted)),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 9),
              Text('EDD ${b.edd ?? '—'} · ${b.weeks ?? '—'} weeks gestation',
                  style: const TextStyle(fontSize: 11.5, color: T.text2)),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _vitalTile('Latest BP', '150/95', 'High — monitor', RiskLevel.high)),
            const SizedBox(width: 11),
            Expanded(child: _vitalTile('Haemoglobin', '9.5', 'Mild anaemia', RiskLevel.medium)),
            const SizedBox(width: 11),
            Expanded(child: _vitalTile('Weight', '58', '+1.2 kg', RiskLevel.low)),
          ],
        ),
        const SectionLabel('Care checklist · সেবা তালিকা', margin: EdgeInsets.fromLTRB(0, 18, 0, 10)),
        AppCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: const [
              _ChecklistRow('TT / Td immunisation · টিটি টিকা', '2 doses', true, false),
              Divider(height: 1, color: T.divider),
              _ChecklistRow('IFA supplementation · আয়রন-ফলিক', 'On track', true, false),
              Divider(height: 1, color: T.divider),
              _ChecklistRow('Calcium supplementation', 'Pending', false, false),
              Divider(height: 1, color: T.divider),
              _ChecklistRow('Birth & complication plan · প্রসব পরিকল্পনা', 'Incomplete', false, true),
            ],
          ),
        ),
        const SizedBox(height: 16),
        PrimaryButton(label: 'Record new ANC visit', onPressed: onVisit),
      ],
    );
  }

  Widget _vitalTile(String label, String value, String sub, RiskLevel level) {
    final style = riskStyle(level);
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: style.bg, borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 11.5, color: style.color)),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: style.color)),
          Text(sub, style: const TextStyle(fontSize: 10.5, color: T.text2)),
        ],
      ),
    );
  }
}

class _ChildProfile extends StatelessWidget {
  const _ChildProfile({required this.b, required this.onRecord});
  final Beneficiary b;
  final VoidCallback onRecord;

  static const _epiChips = <(String, String)>[
    ('BCG', 'done'),
    ('Penta-3', 'due'),
    ('PCV-3', 'due'),
    ('IPV', 'due'),
    ('MR-1', 'due'),
  ];

  @override
  Widget build(BuildContext context) {
    final muac = classifyMuac(b.muac ?? 11.2, false);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: muac.bg,
            border: Border.all(color: muac.color),
            borderRadius: BorderRadius.circular(13),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('${muac.short} · ${muac.label}',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5, color: muac.color)),
              const SizedBox(height: 5),
              Text('→ ${muac.action}',
                  style: TextStyle(fontSize: 12, color: muac.color, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _stat('MUAC', '${b.muac ?? '—'}', T.riskHigh)),
            const SizedBox(width: 11),
            Expanded(child: _stat('Weight-for-age', '−2.6', T.riskHigh)),
            const SizedBox(width: 11),
            Expanded(child: _stat('Length-for-age', '−1.9', T.riskMedium)),
          ],
        ),
        const SectionLabel('Immunisation (EPI) · টিকা', margin: EdgeInsets.fromLTRB(0, 18, 0, 10)),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final e in _epiChips)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: e.$2 == 'done' ? const Color(0xFFE0EFEA) : const Color(0xFFF7E4DE),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 15,
                      height: 15,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: e.$2 == 'done' ? const Color(0xFF03803D) : const Color(0xFFC0492E),
                        shape: BoxShape.circle,
                      ),
                      child: Text(e.$2 == 'done' ? '✓' : '!',
                          style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w700)),
                    ),
                    const SizedBox(width: 5),
                    Text(e.$1, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
                  ],
                ),
              ),
          ],
        ),
        const SizedBox(height: 16),
        PrimaryButton(label: 'Record growth & nutrition', onPressed: onRecord),
      ],
    );
  }

  Widget _stat(String label, String value, Color color) => AppCard(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, color: T.text2)),
            Text(value, style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: color)),
          ],
        ),
      );
}

class _GeneralProfile extends StatelessWidget {
  const _GeneralProfile({required this.b, required this.onRecord});
  final Beneficiary b;
  final VoidCallback onRecord;

  @override
  Widget build(BuildContext context) {
    final meta = generalProfileMeta(b.type);
    final t = typeLine(b);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFE0EFEA),
            border: Border.all(color: T.brand),
            borderRadius: BorderRadius.circular(13),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(meta.title,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5, color: T.brandDeep)),
              const SizedBox(height: 4),
              Text('${meta.bn} · ${t.en}', style: const TextStyle(fontSize: 12, color: T.brand)),
              if (b.reason != null) ...[
                const SizedBox(height: 8),
                Text(b.reason!, style: const TextStyle(fontSize: 12, color: T.textSoft)),
              ],
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _stat('Age · বয়স', '${b.age ?? '—'}', T.text)),
            const SizedBox(width: 11),
            Expanded(child: _stat('Risk · ঝুঁকি', '${b.risk.capitalized} risk', riskStyle(b.risk).color)),
            const SizedBox(width: 11),
            Expanded(child: _stat('Next visit', b.next, T.text)),
          ],
        ),
        const SectionLabel('Care checklist · সেবা তালিকা', margin: EdgeInsets.fromLTRB(0, 18, 0, 10)),
        AppCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              for (var i = 0; i < meta.items.length; i++) ...[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                  child: Row(
                    children: [
                      Container(
                        width: 18,
                        height: 18,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(color: meta.items[i].color, borderRadius: BorderRadius.circular(5)),
                        child: Text(meta.items[i].mark,
                            style: const TextStyle(color: Colors.white, fontSize: 12)),
                      ),
                      const SizedBox(width: 11),
                      Expanded(child: Text(meta.items[i].label, style: const TextStyle(fontSize: 13))),
                      Text(meta.items[i].statusLabel,
                          style: TextStyle(fontSize: 11, color: meta.items[i].color, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
                if (i < meta.items.length - 1) const Divider(height: 1, color: T.divider),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),
        PrimaryButton(label: 'Record new visit · নতুন পরিদর্শন', onPressed: onRecord),
      ],
    );
  }

  Widget _stat(String label, String value, Color color) => AppCard(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, color: T.text2)),
            const SizedBox(height: 3),
            Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: color)),
          ],
        ),
      );
}

class _ChecklistRow extends StatelessWidget {
  const _ChecklistRow(this.label, this.status, this.good, this.warn);
  final String label;
  final String status;
  final bool good;
  final bool warn;

  @override
  Widget build(BuildContext context) {
    final color = good ? T.brand : T.amber;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
      child: Row(
        children: [
          Container(
            width: 18,
            height: 18,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(5)),
            child: good
                ? const Icon(Icons.check, size: 12, color: Colors.white)
                : const Text('!', style: TextStyle(color: Colors.white, fontSize: 12)),
          ),
          const SizedBox(width: 11),
          Expanded(child: Text(label, style: const TextStyle(fontSize: 13))),
          Text(status, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
