/// Cross-platform SQLite bootstrap.
///
/// `sqflite` only ships native SQLite for Android and iOS. Desktop and web need
/// different factories, and the packages that provide them pull in `dart:ffi` /
/// `dart:io` (desktop) or web-only APIs — neither of which compiles on the other
/// side. A conditional import keeps each platform's code out of the other's
/// build: native builds get [db_factory_native.dart], web builds get
/// [db_factory_web.dart]. Call [initDatabaseFactory] once before any DB access.
import 'db_factory_native.dart'
    if (dart.library.js_interop) 'db_factory_web.dart' as impl;

/// Selects the correct `databaseFactory` for the current platform.
/// Safe to call more than once.
Future<void> initDatabaseFactory() => impl.initDatabaseFactory();
