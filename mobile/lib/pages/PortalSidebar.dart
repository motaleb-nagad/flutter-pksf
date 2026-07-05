import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../domain/seed.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';

const _nav = <(PortalSection, IconData, String)>[
  (PortalSection.dashboard, Icons.dashboard_outlined, 'Dashboard'),
  (PortalSection.beneficiaries, Icons.people_outline, 'Beneficiaries'),
  (PortalSection.indicators, Icons.speed_outlined, 'Indicators'),
  (PortalSection.workers, Icons.badge_outlined, 'Field officers'),
];

const _disabled = <(IconData, String)>[
  (Icons.description_outlined, 'Reports'),
  (Icons.settings_outlined, 'Settings'),
];

class PortalSidebar extends StatelessWidget {
  const PortalSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return Container(
      color: T.brandDeep,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 8, 18),
                child: Row(
                  children: [
                    Container(
                      width: 30,
                      height: 30,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.add, color: T.brandDeep, size: 18),
                    ),
                    const SizedBox(width: 9),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('মা ও শিশু',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14)),
                        Text('MCH Surveillance',
                            style: TextStyle(color: Colors.white70, fontSize: 10)),
                      ],
                    ),
                  ],
                ),
              ),
              for (final n in _nav) _navItem(context, state, n.$1, n.$2, n.$3),
              for (final d in _disabled) _disabledItem(d.$1, d.$2),
              const Spacer(),
              const Divider(color: Colors.white24),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(CurrentSupervisor.upazila,
                            style: TextStyle(color: Colors.white70, fontSize: 11)),
                        Text('${CurrentSupervisor.name} · Supervisor',
                            style: TextStyle(color: Colors.white70, fontSize: 11)),
                      ],
                    ),
                  ),
                  TextButton.icon(
                    onPressed: state.adminLogout,
                    icon: const Icon(Icons.power_settings_new, color: Colors.white, size: 13),
                    label: const Text('Logout', style: TextStyle(color: Colors.white, fontSize: 11.5)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _navItem(BuildContext context, AppState state, PortalSection key, IconData icon, String label) {
    final active = state.portalSection == key;
    return Container(
      margin: const EdgeInsets.only(bottom: 3),
      decoration: BoxDecoration(
        color: active ? Colors.white.withOpacity(0.16) : Colors.transparent,
        borderRadius: BorderRadius.circular(9),
      ),
      child: ListTile(
        dense: true,
        leading: Icon(icon, size: 18, color: active ? Colors.white : Colors.white70),
        title: Text(label,
            style: TextStyle(
                color: active ? Colors.white : Colors.white70,
                fontSize: 13,
                fontWeight: FontWeight.w500)),
        onTap: () {
          state.setSection(key);
          Navigator.of(context).maybePop();
        },
      ),
    );
  }

  Widget _disabledItem(IconData icon, String label) => ListTile(
        dense: true,
        leading: Icon(icon, size: 18, color: Colors.white38),
        title: Text(label, style: const TextStyle(color: Colors.white38, fontSize: 13)),
        trailing: const Text('soon', style: TextStyle(color: Colors.white38, fontSize: 10)),
      );
}
