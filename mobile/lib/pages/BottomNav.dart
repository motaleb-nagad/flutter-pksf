import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/tokens.dart';

class BottomNav extends StatelessWidget {
  const BottomNav({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE5E1D8))),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _item(Icons.home_outlined, 'Home', state.tab == AppTab.home,
                () => state.go(AppScreen.home, AppTab.home)),
            _item(Icons.list, 'তালিকা', state.tab == AppTab.cases,
                () => state.setFilter(ListFilter.all)),
            Expanded(
              child: InkWell(
                onTap: () => state.go(AppScreen.register, AppTab.add),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 5),
                  child: Center(
                    child: Container(
                      width: 42,
                      height: 42,
                      decoration: const BoxDecoration(color: T.brand, shape: BoxShape.circle),
                      child: const Icon(Icons.add, color: Colors.white, size: 22),
                    ),
                  ),
                ),
              ),
            ),
            _item(Icons.warning_amber_rounded, 'সতর্কতা', state.tab == AppTab.alerts,
                () => state.setFilter(ListFilter.high)),
            _item(Icons.monitor_outlined, 'Portal', false, () => state.setView(AppView.portal)),
          ],
        ),
      ),
    );
  }

  Widget _item(IconData icon, String label, bool active, VoidCallback onTap) {
    final color = active ? T.brand : T.textMuted;
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(0, 9, 0, 11),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 20, color: color),
              const SizedBox(height: 3),
              Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: color)),
            ],
          ),
        ),
      ),
    );
  }
}
