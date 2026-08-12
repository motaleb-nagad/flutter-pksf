/// Native (non-web) SQLite factory selection.
///
/// - Android / iOS: use the default `sqflite` factory (no setup needed).
/// - Windows / Linux / macOS: use the FFI factory backed by the bundled SQLite.
import 'dart:io' show Platform;

// `sqflite_ffi.dart` re-exports `databaseFactory`, so no separate sqflite import.
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

Future<void> initDatabaseFactory() async {
  if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
    // Initialise the FFI loader and route sqflite through it.
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }
  // Android and iOS keep sqflite's default factory.
}
