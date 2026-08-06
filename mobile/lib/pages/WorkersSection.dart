import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../widgets/widgets.dart';
import '../domain/format.dart';
import '../domain/models.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';
import 'OnboardModal.dart';

class WorkersSection extends StatelessWidget {
  const WorkersSection({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final workers = state.workers;
    final totalVisits = workers.fold<int>(0, (a, w) => a + w.visits);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(child: _stat('Active officers', '${workers.length}')),
            const SizedBox(width: 12),
            Expanded(child: _stat('Visits this month', '$totalVisits')),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => showDialog<void>(
              context: context,
              builder: (_) => ChangeNotifierProvider<AppState>.value(
                value: state,
                child: const OnboardModal(),
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: T.brand,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            icon: const Icon(Icons.add, size: 16),
            label: const Text('Onboard field officer'),
          ),
        ),
        const SizedBox(height: 14),
        AppCard(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Field officers · মাঠকর্মী',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              const SizedBox(height: 8),
              for (final w in workers) _workerRow(w),
            ],
          ),
        ),
      ],
    );
  }

  Widget _stat(String label, String value) => AppCard(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 12, color: T.text2)),
            const SizedBox(height: 3),
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
          ],
        ),
      );

  Widget _workerRow(Worker w) {
    final online = w.status == OnlineStatus.online;
    final cc = covColor(w.cov);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 11),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            alignment: Alignment.center,
            decoration: const BoxDecoration(color: Color(0xFFE0EFEA), shape: BoxShape.circle),
            child: Text(initials(w.name),
                style: const TextStyle(color: T.brand, fontWeight: FontWeight.w700, fontSize: 12)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(w.name, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
                Text('${w.role.label} · ${w.union} · ${w.assigned} assigned (${w.high} HR)',
                    style: const TextStyle(fontSize: 11, color: T.text2)),
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Row(
                    children: [
                      Text('ANC4+ ${w.cov}%',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: cc)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(3),
                          child: LinearProgressIndicator(
                            value: w.cov / 100,
                            minHeight: 6,
                            backgroundColor: const Color(0xFFEFEBE2),
                            valueColor: AlwaysStoppedAnimation<Color>(cc),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                decoration: BoxDecoration(
                  color: online ? const Color(0xFFE0EFEA) : const Color(0xFFF5EAD6),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(online ? 'Online' : 'Offline',
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: online ? T.brand : T.riskMedium)),
              ),
              const SizedBox(height: 3),
              Text(w.lastSync, style: const TextStyle(fontSize: 10.5, color: T.textMuted)),
            ],
          ),
        ],
      ),
    );
  }
}
