import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/tokens.dart';
import 'AncVisitPage.dart';
import 'BeneficiaryListPage.dart';
import 'BottomNav.dart';
import 'ChildHealthPage.dart';
import 'HomePage.dart';
import 'LoginPage.dart';
import 'ProfilePage.dart';
import 'RegisterPage.dart';

/// The offline field-officer mobile app: login gate → screen + persistent nav.
class FieldShell extends StatelessWidget {
  const FieldShell({super.key});

  @override
  Widget build(BuildContext context) {
    final loggedIn = context.select<AppState, bool>((s) => s.loggedIn);
    if (!loggedIn) return const LoginPage();

    final screen = context.select<AppState, AppScreen>((s) => s.screen);
    return Container(
      color: T.appBg,
      child: Column(
        children: [
          Expanded(child: _screenFor(screen)),
          const BottomNav(),
        ],
      ),
    );
  }

  Widget _screenFor(AppScreen screen) {
    switch (screen) {
      case AppScreen.home:
        return const HomePage();
      case AppScreen.list:
        return const BeneficiaryListPage();
      case AppScreen.register:
        return const RegisterPage();
      case AppScreen.visit:
        return const AncVisitPage();
      case AppScreen.child:
        return const ChildHealthPage();
      case AppScreen.profile:
        return const ProfilePage();
    }
  }
}
