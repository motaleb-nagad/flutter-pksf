import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/tokens.dart';
import 'bottom_nav.dart';
import 'child_screen.dart';
import 'home_screen.dart';
import 'list_screen.dart';
import 'login_screen.dart';
import 'profile_screen.dart';
import 'register_screen.dart';
import 'visit_screen.dart';

/// The offline field-officer mobile app: login gate → screen + persistent nav.
class FieldApp extends StatelessWidget {
  const FieldApp({super.key});

  @override
  Widget build(BuildContext context) {
    final loggedIn = context.select<AppState, bool>((s) => s.loggedIn);
    if (!loggedIn) return const LoginScreen();

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
        return const HomeScreen();
      case AppScreen.list:
        return const ListScreen();
      case AppScreen.register:
        return const RegisterScreen();
      case AppScreen.visit:
        return const VisitScreen();
      case AppScreen.child:
        return const ChildScreen();
      case AppScreen.profile:
        return const ProfileScreen();
    }
  }
}
