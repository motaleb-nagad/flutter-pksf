import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../domain/format.dart';
import '../domain/models.dart';
import '../domain/risk.dart';
import '../domain/seed.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';
import '../widgets/widgets.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final all = state.beneficiaries;
    final dueToday = all.where((b) => b.next == 'Due today').toList();
    final highCount = all.where((b) => b.risk == RiskLevel.high).length;

    return ListView(
      padding: EdgeInsets.zero,
      children: [
        _header(context, state),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: _stat('${dueToday.length}', 'Visits due today', 'আজকের পরিদর্শন', T.brand)),
                  const SizedBox(width: 11),
                  Expanded(child: _stat('$highCount', 'High-risk cases', 'উচ্চ ঝুঁকি', T.riskHigh)),
                ],
              ),
              const SizedBox(height: 13),
              Row(
                children: [
                  Expanded(
                    child: _actionBtn(
                      onTap: () => state.go(AppScreen.register, AppTab.add),
                      filled: true,
                      icon: Icons.add,
                      title: 'New registration',
                      sub: 'নতুন নিবন্ধন',
                    ),
                  ),
                  const SizedBox(width: 11),
                  Expanded(
                    child: _actionBtn(
                      onTap: () => state.setFilter(ListFilter.all),
                      filled: false,
                      icon: Icons.list,
                      title: 'All beneficiaries',
                      sub: 'উপকারভোগী',
                    ),
                  ),
                ],
              ),
              const Padding(
                padding: EdgeInsets.fromLTRB(2, 20, 2, 10),
                child: Text.rich(
                  TextSpan(children: [
                    TextSpan(text: 'Due today ', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    TextSpan(text: '· আজকের কাজ', style: TextStyle(color: T.text2, fontSize: 14)),
                  ]),
                ),
              ),
              ...dueToday.map((b) => _caseCard(context, b)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _header(BuildContext context, AppState state) {
    return Container(
      color: T.brand,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 18),
          child: Column(
            children: [
              Row(
                children: [
                  _circle(CurrentOfficer.initials, 40, 0.18),
                  const SizedBox(width: 11),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(CurrentOfficer.name,
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15.5)),
                        Text('${CurrentOfficer.role} · ${CurrentOfficer.union}',
                            style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 12)),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: state.appLogout,
                    tooltip: 'Log out · প্রস্থান',
                    icon: const Icon(Icons.power_settings_new, color: Colors.white, size: 18),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              _syncBanner(context, state),
            ],
          ),
        ),
      ),
    );
  }

  Widget _syncBanner(BuildContext context, AppState state) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.16),
        borderRadius: BorderRadius.circular(11),
      ),
      child: Row(
        children: [
          Container(
            width: 9,
            height: 9,
            decoration: BoxDecoration(
              color: state.online ? const Color(0xFF7BE0A3) : T.warningDot,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text.rich(
                  TextSpan(
                    style: const TextStyle(color: Colors.white, fontSize: 12.5),
                    children: [
                      TextSpan(
                          text: state.online ? 'Online' : 'Offline',
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                      TextSpan(
                          text:
                              ' · ${state.online ? 'অনলাইন' : 'অফলাইন'} · ${state.pending} record${state.pending == 1 ? '' : 's'} pending sync'),
                    ],
                  ),
                ),
                Text('Last synced ${state.lastSynced}',
                    style: TextStyle(color: Colors.white.withOpacity(0.75), fontSize: 11)),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: state.pending == 0 || state.syncing ? null : state.sync,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: T.brand,
              disabledBackgroundColor: Colors.white.withOpacity(0.6),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              textStyle: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
            ),
            child: Text(state.syncing ? 'Syncing…' : 'Sync'),
          ),
        ],
      ),
    );
  }

  Widget _circle(String text, double size, double opacity) => Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        decoration: BoxDecoration(color: Colors.white.withOpacity(opacity), shape: BoxShape.circle),
        child: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15)),
      );

  Widget _stat(String value, String en, String bn, Color color) => AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value, style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700, color: color)),
            const SizedBox(height: 2),
            Text(en, style: const TextStyle(fontSize: 12.5, color: T.text2)),
            Text(bn, style: const TextStyle(fontSize: 11, color: T.text2)),
          ],
        ),
      );

  Widget _actionBtn({
    required VoidCallback onTap,
    required bool filled,
    required IconData icon,
    required String title,
    required String sub,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        decoration: BoxDecoration(
          color: filled ? T.brand : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: filled ? null : Border.all(color: T.border4),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: filled ? Colors.white : T.text, size: 20),
            const SizedBox(height: 5),
            Text(title,
                style: TextStyle(
                    fontWeight: FontWeight.w600, fontSize: 13.5, color: filled ? Colors.white : T.text)),
            Text(sub,
                style: TextStyle(
                    fontSize: 11, color: filled ? Colors.white.withOpacity(0.85) : T.text2)),
          ],
        ),
      ),
    );
  }

  Widget _caseCard(BuildContext context, Beneficiary b) {
    final t = typeLine(b);
    return AppCard(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      leftAccent: riskStyle(b.risk).color,
      onTap: () => context.read<AppState>().openProfile(b.id),
      child: Row(
        children: [
          Avatar(name: b.name, level: b.risk),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(b.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14.5)),
                Text('${t.en} · ${b.village}', style: const TextStyle(fontSize: 12, color: T.text2)),
              ],
            ),
          ),
          RiskBadge(level: b.risk),
        ],
      ),
    );
  }
}
