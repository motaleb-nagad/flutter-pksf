import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../domain/format.dart';
import '../domain/risk.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';
import '../widgets/widgets.dart';

const _chips = <(ListFilter, String)>[
  (ListFilter.all, 'All'),
  (ListFilter.adolescent, 'Adolescent'),
  (ListFilter.elderly, 'Elderly'),
  (ListFilter.disabled, 'Disability'),
  (ListFilter.pregnant, 'Pregnant'),
  (ListFilter.child, 'Child'),
];

class BeneficiaryListPage extends StatefulWidget {
  const BeneficiaryListPage({super.key});

  @override
  State<BeneficiaryListPage> createState() => _ListScreenState();
}

class _ListScreenState extends State<BeneficiaryListPage> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    var cases = filterBeneficiaries(state.beneficiaries, state.listFilter);
    final q = _query.trim().toLowerCase();
    if (q.isNotEmpty) {
      cases = cases
          .where((b) =>
              b.name.toLowerCase().contains(q) ||
              b.bn.contains(_query.trim()) ||
              b.code.toLowerCase().contains(q))
          .toList();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          color: Colors.white,
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Beneficiaries', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17)),
                  const Text('উপকারভোগীর তালিকা', style: TextStyle(fontSize: 12.5, color: T.text2)),
                  const SizedBox(height: 11),
                  Container(
                    decoration: BoxDecoration(
                        color: const Color(0xFFF2EFE8), borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Row(
                      children: [
                        const Icon(Icons.search, size: 16, color: T.textMuted),
                        const SizedBox(width: 9),
                        Expanded(
                          child: TextField(
                            onChanged: (v) => setState(() => _query = v),
                            decoration: const InputDecoration(
                              isDense: true,
                              border: InputBorder.none,
                              hintText: 'Search name or ID · নাম খুঁজুন',
                              hintStyle: TextStyle(fontSize: 13.5, color: T.textMuted),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 11),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        for (final c in _chips)
                          Padding(
                            padding: const EdgeInsets.only(right: 7),
                            child: _chip(state, c.$1, c.$2),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        Expanded(
          child: cases.isEmpty
              ? const Center(
                  child: Padding(
                    padding: EdgeInsets.all(30),
                    child: Text('No beneficiaries match · কোনো ফলাফল নেই',
                        style: TextStyle(color: T.textMuted, fontSize: 13)),
                  ),
                )
              : ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  children: [
                    for (final b in cases)
                      AppCard(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(12),
                        leftAccent: riskStyle(b.risk).color,
                        onTap: () => state.openProfile(b.id),
                        child: Row(
                          children: [
                            Avatar(name: b.name, level: b.risk, size: 44),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(b.name,
                                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14.5)),
                                  Text('${typeLine(b).en} · ${b.village}',
                                      style: const TextStyle(fontSize: 12, color: T.text2)),
                                  Text('${b.code} · next ${b.next}',
                                      style: const TextStyle(fontSize: 10.5, color: T.textMuted)),
                                ],
                              ),
                            ),
                            RiskBadge(level: b.risk, text: 'bn'),
                          ],
                        ),
                      ),
                  ],
                ),
        ),
      ],
    );
  }

  Widget _chip(AppState state, ListFilter key, String label) {
    final on = state.listFilter == key;
    return GestureDetector(
      onTap: () => state.setFilter(key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 7),
        decoration: BoxDecoration(
          color: on ? T.brand : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: on ? T.brand : const Color(0xFFE5E1D8)),
        ),
        child: Text(label,
            style: TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w600,
                color: on ? Colors.white : const Color(0xFF5C594F))),
      ),
    );
  }
}
