import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/tokens.dart';
import 'widgets.dart';

/// Multi-field registration capturing personal, location (GPS) & pregnancy data.
/// Fields are pre-filled to match the design reference; saving advances to the
/// first ANC visit.
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String _gps = '22.318° N, 90.951° E';
  bool _capturing = false;

  void _captureGps() {
    setState(() => _capturing = true);
    // A real device would read GPS; we simulate a capture for the prototype.
    Future<void>.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _gps = '22.318° N, 90.951° E';
        _capturing = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = context.read<AppState>();
    return Column(
      children: [
        ScreenHeader(
          title: 'New registration',
          subtitle: 'নতুন নিবন্ধন',
          onBack: () => state.go(AppScreen.home, AppTab.home),
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.18),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text('Step 1 / 3', style: TextStyle(color: Colors.white, fontSize: 12)),
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const SectionLabel('Personal · ব্যক্তিগত তথ্য'),
              AppCard(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                child: Column(
                  children: [
                    _field('Full name · নাম', 'Rahima Begum'),
                    Row(
                      children: [
                        Expanded(child: _field('Age · বয়স', '19')),
                        const SizedBox(width: 14),
                        Expanded(flex: 2, child: _field('Mobile · মোবাইল', '017XX-XXXXXX')),
                      ],
                    ),
                    _field('NID / Birth reg. no.', '1990 4521 8847', last: true),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              const SectionLabel('Location · অবস্থান'),
              AppCard(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(child: _field('Village · গ্রাম', 'Char Bhola')),
                        const SizedBox(width: 14),
                        Expanded(child: _field('Union', 'Char Bhola')),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 11),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('GPS location', style: TextStyle(fontSize: 11.5, color: T.text2)),
                                const SizedBox(height: 3),
                                Text(_gps, style: const TextStyle(fontSize: 12.5)),
                              ],
                            ),
                          ),
                          TextButton.icon(
                            onPressed: _captureGps,
                            icon: const Icon(Icons.location_on, size: 14, color: T.brand),
                            label: Text(_capturing ? 'Capturing…' : 'Captured',
                                style: const TextStyle(fontSize: 11.5, color: T.brand, fontWeight: FontWeight.w600)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              const SectionLabel('Pregnancy · গর্ভকাল'),
              AppCard(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(child: _field('LMP · শেষ মাসিক', '05 Jan 2026')),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Padding(
                                padding: EdgeInsets.only(top: 11),
                                child: Text('EDD (auto)', style: TextStyle(fontSize: 11.5, color: T.brand)),
                              ),
                              const Padding(
                                padding: EdgeInsets.only(top: 3, bottom: 11),
                                child: Text('12 Aug 2026',
                                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _field('Gravida', '2', last: true)),
                        const SizedBox(width: 14),
                        Expanded(child: _field('Para', '1', last: true)),
                        const SizedBox(width: 14),
                        Expanded(child: _field('Blood grp', 'B+', last: true)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              PrimaryButton(
                label: 'Save & start first ANC visit →',
                onPressed: () => state.go(AppScreen.visit, AppTab.add),
              ),
              const SizedBox(height: 9),
              const Center(
                child: Text('Saved offline · will sync automatically',
                    style: TextStyle(fontSize: 11.5, color: T.textMuted)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _field(String label, String value, {bool last = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 11),
      decoration: BoxDecoration(
        border: last ? null : const Border(bottom: BorderSide(color: T.divider)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11.5, color: T.text2)),
          const SizedBox(height: 3),
          TextFormField(
            initialValue: value,
            style: const TextStyle(fontSize: 14.5, color: T.text),
            decoration: const InputDecoration(
              isDense: true,
              border: InputBorder.none,
              contentPadding: EdgeInsets.zero,
            ),
          ),
        ],
      ),
    );
  }
}
