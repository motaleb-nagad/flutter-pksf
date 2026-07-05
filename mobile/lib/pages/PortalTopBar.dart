import 'package:flutter/material.dart';

import '../domain/seed.dart';
import '../theme/tokens.dart';

/// Scope + sync status band shown under the portal app bar.
class PortalTopBar extends StatelessWidget {
  const PortalTopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: T.portalHeaderBg,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: const BoxDecoration(
        color: T.portalHeaderBg,
        border: Border(bottom: BorderSide(color: T.border3)),
      ),
      child: Row(
        children: [
          const Expanded(
            child: Text(CurrentSupervisor.scope, style: TextStyle(fontSize: 12, color: T.text2)),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
            decoration: BoxDecoration(color: const Color(0xFFE0EFEA), borderRadius: BorderRadius.circular(20)),
            child: const Text('● Synced · 09:12', style: TextStyle(fontSize: 12, color: T.brand)),
          ),
        ],
      ),
    );
  }
}
