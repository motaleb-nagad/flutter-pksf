/// Domain models for the MCH surveillance system. Mirrors the backend JSON
/// (Spring Boot) so the same objects round-trip through the API and the local
/// offline store.

enum RiskLevel {
  low('low', 0),
  medium('medium', 1),
  high('high', 2);

  const RiskLevel(this.json, this.order);
  final String json;
  final int order;

  static RiskLevel fromJson(String value) =>
      RiskLevel.values.firstWhere((r) => r.json == value, orElse: () => RiskLevel.low);

  /// The more severe of two levels.
  static RiskLevel max(RiskLevel a, RiskLevel b) => a.order >= b.order ? a : b;

  String get capitalized => '${json[0].toUpperCase()}${json.substring(1)}';
}

enum BeneficiaryType {
  anc('anc'),
  pnc('pnc'),
  child('child'),
  adolescent('adolescent'),
  elderly('elderly'),
  disabled('disabled');

  const BeneficiaryType(this.json);
  final String json;

  static BeneficiaryType fromJson(String value) =>
      BeneficiaryType.values.firstWhere((t) => t.json == value, orElse: () => BeneficiaryType.child);
}

enum WorkerRole { fwa, fwv, chcp, ha }

extension WorkerRoleX on WorkerRole {
  String get label => name.toUpperCase();
  static WorkerRole fromJson(String value) =>
      WorkerRole.values.firstWhere((r) => r.name == value.toLowerCase(), orElse: () => WorkerRole.fwa);
}

enum OnlineStatus { online, offline }

/// A bilingual label — English with a Bangla (বাংলা) secondary string.
class Bilingual {
  const Bilingual(this.en, this.bn);
  final String en;
  final String bn;
}

class Beneficiary {
  Beneficiary({
    required this.id,
    required this.name,
    required this.bn,
    required this.type,
    required this.village,
    required this.code,
    required this.risk,
    required this.next,
    this.reason,
    this.age,
    this.months,
    this.weeks,
    this.anc,
    this.edd,
    this.day,
    this.muac,
  });

  final String id;
  final String name;
  final String bn; // Bangla name
  final BeneficiaryType type;
  final String village;
  final String code; // human ID, e.g. ANC-2451
  RiskLevel risk;
  String? reason;
  String next; // next visit label, e.g. "Due today" / "10 Jul"
  final int? age;
  final int? months; // for children
  final int? weeks; // ANC gestational weeks
  int? anc; // ANC contact count
  final String? edd; // expected date of delivery
  final int? day; // PNC day
  double? muac; // child MUAC (cm)

  Beneficiary copyWith({
    RiskLevel? risk,
    String? reason,
    String? next,
    int? anc,
    double? muac,
  }) {
    return Beneficiary(
      id: id,
      name: name,
      bn: bn,
      type: type,
      village: village,
      code: code,
      risk: risk ?? this.risk,
      reason: reason ?? this.reason,
      next: next ?? this.next,
      age: age,
      months: months,
      weeks: weeks,
      anc: anc ?? this.anc,
      edd: edd,
      day: day,
      muac: muac ?? this.muac,
    );
  }

  factory Beneficiary.fromJson(Map<String, dynamic> j) => Beneficiary(
        id: j['id'] as String,
        name: j['name'] as String,
        bn: j['bn'] as String? ?? '',
        type: BeneficiaryType.fromJson(j['type'] as String),
        village: j['village'] as String? ?? '',
        code: j['code'] as String? ?? '',
        risk: RiskLevel.fromJson(j['risk'] as String),
        next: j['next'] as String? ?? '',
        reason: j['reason'] as String?,
        age: (j['age'] as num?)?.toInt(),
        months: (j['months'] as num?)?.toInt(),
        weeks: (j['weeks'] as num?)?.toInt(),
        anc: (j['anc'] as num?)?.toInt(),
        edd: j['edd'] as String?,
        day: (j['day'] as num?)?.toInt(),
        muac: (j['muac'] as num?)?.toDouble(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'bn': bn,
        'type': type.json,
        'village': village,
        'code': code,
        'risk': risk.json,
        'next': next,
        'reason': reason,
        'age': age,
        'months': months,
        'weeks': weeks,
        'anc': anc,
        'edd': edd,
        'day': day,
        'muac': muac,
      };
}

class Worker {
  Worker({
    required this.id,
    required this.name,
    required this.role,
    required this.union,
    required this.assigned,
    required this.high,
    required this.visits,
    required this.cov,
    required this.lastSync,
    required this.status,
  });

  final String id;
  final String name;
  final WorkerRole role;
  final String union;
  final int assigned;
  final int high;
  final int visits;
  final int cov; // ANC4+ coverage %
  final String lastSync;
  final OnlineStatus status;

  factory Worker.fromJson(Map<String, dynamic> j) => Worker(
        id: j['id'] as String,
        name: j['name'] as String,
        role: WorkerRoleX.fromJson(j['role'] as String),
        union: j['union'] as String? ?? '',
        assigned: (j['assigned'] as num?)?.toInt() ?? 0,
        high: (j['high'] as num?)?.toInt() ?? 0,
        visits: (j['visits'] as num?)?.toInt() ?? 0,
        cov: (j['cov'] as num?)?.toInt() ?? 0,
        lastSync: j['lastSync'] as String? ?? 'Never',
        status: (j['status'] as String?) == 'online' ? OnlineStatus.online : OnlineStatus.offline,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'role': role.name,
        'union': union,
        'assigned': assigned,
        'high': high,
        'visits': visits,
        'cov': cov,
        'lastSync': lastSync,
        'status': status.name,
      };
}

/// Antenatal danger signs (any present → high risk).
class DangerSigns {
  DangerSigns({
    this.headache = false,
    this.blurred = false,
    this.swelling = false,
    this.bleeding = false,
    this.convulsions = false,
    this.fever = false,
    this.fetal = false,
    this.abdo = false,
    this.breathing = false,
  });

  bool headache;
  bool blurred;
  bool swelling;
  bool bleeding;
  bool convulsions;
  bool fever;
  bool fetal; // reduced fetal movement
  bool abdo; // abdominal pain
  bool breathing;

  Map<String, dynamic> toJson() => {
        'headache': headache,
        'blurred': blurred,
        'swelling': swelling,
        'bleeding': bleeding,
        'convulsions': convulsions,
        'fever': fever,
        'fetal': fetal,
        'abdo': abdo,
        'breathing': breathing,
      };
}

/// Antenatal visit vitals + danger signs (drives automatic risk classification).
class AncVisit {
  AncVisit({
    required this.sbp,
    required this.dbp,
    required this.weight,
    required this.hb,
    required this.fundal,
    required this.fhr,
    this.note = '',
    DangerSigns? danger,
  }) : danger = danger ?? DangerSigns();

  int sbp;
  int dbp;
  double weight;
  double hb;
  double fundal;
  int fhr;
  String note;
  DangerSigns danger;

  Map<String, dynamic> toJson() => {
        'sbp': sbp,
        'dbp': dbp,
        'weight': weight,
        'hb': hb,
        'fundal': fundal,
        'fhr': fhr,
        'note': note,
        'danger': danger.toJson(),
      };
}

class AncServices {
  AncServices({this.ifa = true, this.tt = true, this.calcium = false});
  bool ifa;
  bool tt;
  bool calcium;
}

class ChildAssessment {
  ChildAssessment({
    required this.muac,
    required this.weight,
    required this.length,
    this.edema = false,
  });

  double muac;
  double weight;
  double length;
  bool edema;

  Map<String, dynamic> toJson() => {
        'muac': muac,
        'weight': weight,
        'length': length,
        'edema': edema,
      };
}

/// A record queued for sync while the device is offline.
class SyncQueueItem {
  SyncQueueItem({
    this.id,
    required this.kind,
    required this.refId,
    required this.label,
    required this.createdAt,
  });

  final int? id;
  final String kind; // visit | registration | child-assessment | worker
  final String refId;
  final String label;
  final int createdAt;

  Map<String, dynamic> toJson() => {
        'kind': kind,
        'refId': refId,
        'label': label,
        'createdAt': createdAt,
      };
}
