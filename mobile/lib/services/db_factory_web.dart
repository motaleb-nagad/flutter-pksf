/// Web SQLite factory.
///
/// Uses the WASM-backed factory from `sqflite_common_ffi_web`, which persists
/// the database in the browser (IndexedDB). The supporting `sqlite3.wasm` and
/// `sqflite_sw.js` assets are generated into `web/` by:
///
///   dart run sqflite_common_ffi_web:setup
import 'package:sqflite/sqflite.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';

Future<void> initDatabaseFactory() async {
  databaseFactory = databaseFactoryFfiWeb;
}
