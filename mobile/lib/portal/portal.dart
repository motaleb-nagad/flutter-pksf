import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/tokens.dart';
import 'portal_login.dart';
import 'sections/beneficiaries_section.dart';
import 'sections/dashboard_section.dart';
import 'sections/indicators_section.dart';
import 'sections/workers_section.dart';
import 'sidebar.dart';
import 'topbar.dart';

/// Supervisor portal: login gate → sidebar (drawer on mobile) + section content.
class Portal extends StatelessWidget {
  const Portal({super.key});

  static const _titles = {
    PortalSection.dashboard: 'Programme Dashboard',
    PortalSection.beneficiaries: 'Beneficiaries',
    PortalSection.workers: 'Field Officers',
    PortalSection.indicators: 'Indicators · WHO framework',
  };

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    if (!state.adminLoggedIn) return const PortalLogin();

    final section = state.portalSection;
    return Scaffold(
      backgroundColor: T.portalBg,
      drawer: const Drawer(child: Sidebar()),
      appBar: AppBar(
        backgroundColor: T.brandDeep,
        foregroundColor: Colors.white,
        title: Text(_titles[section] ?? '', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
        actions: [
          TextButton.icon(
            onPressed: () => state.setView(AppView.app),
            icon: const Icon(Icons.smartphone, color: Colors.white, size: 16),
            label: const Text('Field app', style: TextStyle(color: Colors.white, fontSize: 12)),
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const TopBar(),
          Expanded(child: _section(section)),
        ],
      ),
    );
  }

  Widget _section(PortalSection section) {
    switch (section) {
      case PortalSection.dashboard:
        return const DashboardSection();
      case PortalSection.beneficiaries:
        return const BeneficiariesSection();
      case PortalSection.indicators:
        return const IndicatorsSection();
      case PortalSection.workers:
        return const WorkersSection();
    }
  }
}
