/// Talks to the Spring Boot backend using **dio** (same package you use in the
/// PKSF login screen). The app is offline-first, so callers treat every method
/// as best-effort: on failure the local SQLite store stays the source of truth.
import 'package:dio/dio.dart';

import '../config/api_config.dart';
import '../domain/models.dart';

class ApiService {
  ApiService()
      : _dio = Dio(BaseOptions(
          baseUrl: ApiConfig.baseUrl,
          connectTimeout: const Duration(seconds: 8),
          receiveTimeout: const Duration(seconds: 8),
          headers: {'Content-Type': 'application/json'},
        ));

  final Dio _dio;

  /// Mocked login — returns {role, profile} on success, null otherwise.
  Future<Map<String, dynamic>?> login(String username, String password) async {
    try {
      final res = await _dio.post('/api/auth/login', data: {
        'username': username,
        'password': password,
      });
      if (res.statusCode == 200 && res.data is Map) {
        return Map<String, dynamic>.from(res.data as Map);
      }
    } on DioException {
      return null; // offline / server down — caller falls back to local session
    }
    return null;
  }

  Future<List<Beneficiary>> beneficiaries() async {
    final res = await _dio.get('/api/beneficiaries');
    final list = res.data as List;
    return list
        .map((e) => Beneficiary.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<List<Worker>> workers() async {
    final res = await _dio.get('/api/workers');
    final list = res.data as List;
    return list
        .map((e) => Worker.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  /// Push the batched offline queue; returns the ref ids the server acknowledged.
  Future<Set<String>> sync(List<SyncQueueItem> items) async {
    final res = await _dio.post('/api/sync', data: {
      'items': items.map((i) => i.toJson()).toList(),
    });
    final body = res.data as Map;
    final acked = (body['acknowledgedRefIds'] as List?) ?? const [];
    return acked.map((e) => e as String).toSet();
  }
}
