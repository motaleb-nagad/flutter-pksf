import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../app/widgets.dart';
import '../../domain/format.dart';
import '../../state/app_state.dart';
import '../../theme/tokens.dart';

class BeneficiariesSection extends StatelessWidget {
  const BeneficiariesSection({super.key});

  @override
  Widget build(BuildContext context) {
    final all = context.watch<AppState>().beneficiaries;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppCard(
          padding: const EdgeInsets.all(8),
          child: Column(
            children: [
              for (final c in all)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 11),
                  child: Row(
                    children: [
                      Avatar(name: c.name, level: c.risk, size: 34),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(c.name, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
                            Text('${c.bn} · ${typeLine(c).en}',
                                style: const TextStyle(fontSize: 11, color: T.textMuted)),
                            Text('${c.code} · ${c.village} · next ${c.next}',
                                style: const TextStyle(fontSize: 11, color: T.text2)),
                          ],
                        ),
                      ),
                      RiskBadge(level: c.risk),
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
