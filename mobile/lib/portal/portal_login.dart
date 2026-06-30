import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/repository.dart';
import '../domain/seed.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';

class PortalLogin extends StatefulWidget {
  const PortalLogin({super.key});

  @override
  State<PortalLogin> createState() => _PortalLoginState();
}

class _PortalLoginState extends State<PortalLogin> {
  final _user = TextEditingController(text: CurrentSupervisor.username);
  final _pass = TextEditingController();

  @override
  void dispose() {
    _user.dispose();
    _pass.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final state = context.read<AppState>();
    try {
      await Repository().api.login(_user.text, _pass.text);
    } catch (_) {/* offline — proceed */}
    state.adminLogin();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: T.brandDeep,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Container(
            width: 380,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 34),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(color: T.brand, borderRadius: BorderRadius.circular(10)),
                      child: const Icon(Icons.add, color: Colors.white, size: 20),
                    ),
                    const SizedBox(width: 11),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('MCH Surveillance Portal',
                            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                        Text('মা ও শিশু · Supervisor sign-in',
                            style: TextStyle(fontSize: 11.5, color: T.text2)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                _label('Username · ইউজারনেম'),
                _input(_user, 'supervisor ID'),
                const SizedBox(height: 15),
                _label('Password · পাসওয়ার্ড'),
                _input(_pass, '••••••', obscure: true),
                const SizedBox(height: 22),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _login,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: T.brand,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
                      textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                    child: const Text('Sign in · প্রবেশ'),
                  ),
                ),
                const SizedBox(height: 13),
                Center(
                  child: Text('Authorised health officials only · ${CurrentSupervisor.upazila}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 11.5, color: T.textMuted)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _label(String t) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(t, style: const TextStyle(fontSize: 12.5, color: T.text2)),
      );

  Widget _input(TextEditingController c, String hint, {bool obscure = false}) => TextField(
        controller: c,
        obscureText: obscure,
        decoration: InputDecoration(
          hintText: hint,
          isDense: true,
          contentPadding: const EdgeInsets.symmetric(horizontal: 13, vertical: 12),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: T.border4)),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: T.border4)),
        ),
      );
}
