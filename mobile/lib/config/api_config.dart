/// Central place for the backend base URL — the same "flip between local and
/// server" pattern used in the PKSF app, but kept in one file instead of being
/// pasted into every request method.
class ApiConfig {
  ApiConfig._();

  // ---- Pick ONE base URL ----
  // Android emulator reaching your PC's localhost:
  static const String local = 'http://10.0.2.2:8080';
  // Your PC's LAN IP for a real device (change to match `ipconfig`):
  // static const String local = 'http://192.168.0.10:8080';
  // Deployed server:
  static const String server = 'http://trnapp.example.org:8080';

  /// The URL every request uses. Override at run time without editing code:
  ///   flutter run --dart-define=API_BASE_URL=http://192.168.0.10:8080
  static const String baseUrl =
      String.fromEnvironment('API_BASE_URL', defaultValue: local);
}
