/// Thin REST client for the Spring Boot backend. The app is offline-first, so
/// every call is best-effort: failures are swallowed by the repository and the
/// local store remains the source of truth until the next successful sync.
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../domain/models.dart';

class ApiClient {
  ApiClient({String? baseUrl}) : baseUrl = baseUrl ?? defaultBaseUrl;

  /// Default base URL.
  ///
  /// `10.0.2.2` is the host machine as seen from the Android emulator. For a
  /// real device or iOS simulator, point this at the machine running the
  /// backend (e.g. via `--dart-define=API_BASE_URL=http://192.168.0.10:8080`).
  static const defaultBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8080',
  );

  final String baseUrl;
  final http.Client _http = http.Client();

  static const _timeout = Duration(seconds: 8);

  Uri _uri(String path) => Uri.parse('$baseUrl$path');

  Future<Map<String, dynamic>?> login(String username, String password) async {
    final res = await _http
        .post(
          _uri('/api/auth/login'),
          headers: const {'Content-Type': 'application/json'},
          body: jsonEncode({'username': username, 'password': password}),
        )
        .timeout(_timeout);
    if (res.statusCode == 200) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    return null;
  }

  Future<List<Beneficiary>> beneficiaries() async {
    final res = await _http.get(_uri('/api/beneficiaries')).timeout(_timeout);
    final list = jsonDecode(res.body) as List<dynamic>;
    return list.map((e) => Beneficiary.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Worker>> workers() async {
    final res = await _http.get(_uri('/api/workers')).timeout(_timeout);
    final list = jsonDecode(res.body) as List<dynamic>;
    return list.map((e) => Worker.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Push the batched offline queue; returns the ref ids the server acknowledged.
  Future<Set<String>> sync(List<SyncQueueItem> items) async {
    final res = await _http
        .post(
          _uri('/api/sync'),
          headers: const {'Content-Type': 'application/json'},
          body: jsonEncode({'items': items.map((i) => i.toJson()).toList()}),
        )
        .timeout(_timeout);
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final acked = (body['acknowledgedRefIds'] as List<dynamic>?) ?? const [];
    return acked.map((e) => e as String).toSet();
  }
}
