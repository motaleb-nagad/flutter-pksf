import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/repository.dart';
import '../domain/seed.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginPage> {
  final _user = TextEditingController(text: CurrentOfficer.username);
  final _pass = TextEditingController();

  @override
  void dispose() {
    _user.dispose();
    _pass.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final state = context.read<AppState>();
    // Best-effort backend auth; the app logs in regardless (offline-first).
    try {
      await Repository().api.login(_user.text, _pass.text);
    } catch (_) {/* offline — proceed with local session */}
    state.appLogin();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: T.brand,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 26),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Spacer(),
              Container(
                width: 62,
                height: 62,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.16),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 30),
              ),
              const SizedBox(height: 20),
              const Text('Preventive Healthcare',
                  style: TextStyle(color: Colors.white, fontSize: 23, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text('মা ও শিশু স্বাস্থ্য · Field Officer',
                  style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 14)),
              const SizedBox(height: 30),
              _label('Username · ইউজারনেম'),
              _input(_user, 'provided by supervisor'),
              const SizedBox(height: 16),
              _label('Password · পাসওয়ার্ড'),
              _input(_pass, '••••••', obscure: true),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: T.brand,
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  child: const Text('Log in · প্রবেশ'),
                ),
              ),
              const SizedBox(height: 14),
              Center(
                child: Text(
                  'Credentials are issued by your supervisor\nfrom the web portal',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12),
                ),
              ),
              const Spacer(),
              Center(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 22),
                  child: Text('Works offline · অফলাইনে কাজ করে',
                      style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 11.5)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(text, style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 12.5)),
      );

  Widget _input(TextEditingController c, String hint, {bool obscure = false}) => TextField(
        controller: c,
        obscureText: obscure,
        style: const TextStyle(color: T.text, fontSize: 15),
        decoration: InputDecoration(
          hintText: hint,
          filled: true,
          fillColor: Colors.white.withOpacity(0.95),
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(11), borderSide: BorderSide.none),
        ),
      );
}
