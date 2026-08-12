/// Central place for the backend base URL — the same "flip between local and
/// server" pattern used in the PKSF app, but kept in one file instead of being
/// pasted into every request method.
///
/// The right "localhost" differs by platform, so the default is chosen at run
/// time:
///   - Android emulator reaches the host PC via the special IP 10.0.2.2
///   - web, desktop (Windows/Linux/macOS) and the iOS simulator use localhost
/// Override any of this without editing code:
///   flutter run --dart-define=API_BASE_URL=http://192.168.0.10:8080
import 'package:flutter/foundation.dart'
    show kIsWeb, defaultTargetPlatform, TargetPlatform;

class ApiConfig {
  ApiConfig._();

  // ---- Local development hosts ----
  /// Loopback for web, desktop and the iOS simulator.
  static const String localhost = 'http://localhost:8080';

  /// The Android emulator's alias for the host machine's localhost.
  static const String androidEmulator = 'http://10.0.2.2:8080';

  /// Your PC's LAN IP for a real device (change to match `ipconfig`/`ifconfig`),
  /// or pass it via --dart-define=API_BASE_URL=...
  // static const String lanDevice = 'http://192.168.0.10:8080';

  /// Deployed server.
  static const String server = 'http://trnapp.example.org:8080';

  /// Compile-time override; empty when not supplied.
  static const String _override =
      String.fromEnvironment('API_BASE_URL', defaultValue: '');

  /// The URL every request uses. A --dart-define override always wins;
  /// otherwise a platform-appropriate localhost is chosen.
  static String get baseUrl {
    if (_override.isNotEmpty) return _override;
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return androidEmulator;
    }
    return localhost;
  }
}
