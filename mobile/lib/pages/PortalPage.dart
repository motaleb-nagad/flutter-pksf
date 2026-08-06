import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/tokens.dart';
import 'BeneficiariesSection.dart';
import 'DashboardSection.dart';
import 'IndicatorsSection.dart';
import 'PortalLoginPage.dart';
import 'PortalSidebar.dart';
import 'PortalTopBar.dart';
import 'WorkersSection.dart';

/// Supervisor portal: login gate → sidebar (drawer on mobile) + section content.
class PortalPage extends StatelessWidget {
  const PortalPage({super.key});

  static const _titles = {
    PortalSection.dashboard: 'Programme Dashboard',
    PortalSection.beneficiaries: 'Beneficiaries',
    PortalSection.workers: 'Field Officers',
    PortalSection.indicators: 'Indicators · WHO framework',
  };

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    if (!state.adminLoggedIn) return const PortalLoginPage();

    final section = state.portalSection;
    return Scaffold(
      backgroundColor: T.portalBg,
      drawer: const Drawer(child: PortalSidebar()),
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
          const PortalTopBar(),
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
