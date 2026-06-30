import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app/field_app.dart';
import 'data/repository.dart';
import 'portal/portal.dart';
import 'state/app_state.dart';
import 'theme/tokens.dart';

void main() {
  runApp(const MchApp());
}

class MchApp extends StatelessWidget {
  const MchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState(Repository())..init(),
      child: MaterialApp(
        title: 'MCH Surveillance',
        debugShowCheckedModeBanner: false,
        theme: buildTheme(),
        home: const RootShell(),
      ),
    );
  }
}

/// Switches between the offline Field Officer app and the Supervisor portal,
/// mirroring the two surfaces of the original handoff.
class RootShell extends StatelessWidget {
  const RootShell({super.key});

  @override
  Widget build(BuildContext context) {
    final view = context.select<AppState, AppView>((s) => s.view);
    return Scaffold(
      backgroundColor: T.pageBg,
      body: view == AppView.app ? const FieldApp() : const Portal(),
    );
  }
}
