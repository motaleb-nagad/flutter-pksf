/// Sample data — Char Bhola Union, Bhola Sadar Upazila (from the design handoff).
/// Used to seed the offline store on first launch so the app works with no network.
import 'models.dart';

List<Beneficiary> seedBeneficiaries() => [
      Beneficiary(id: 'b1', name: 'Rahima Begum', bn: 'রহিমা বেগম', age: 19, type: BeneficiaryType.anc, weeks: 32, village: 'Char Bhola', code: 'ANC-2451', anc: 3, edd: '12 Aug 2026', risk: RiskLevel.high, reason: 'Raised BP, age under 20', next: 'Due today'),
      Beneficiary(id: 'b3', name: 'Morjina Begum', bn: 'মর্জিনা বেগম', age: 34, type: BeneficiaryType.anc, weeks: 28, village: 'Char Bhola', code: 'ANC-2439', anc: 4, edd: '02 Sep 2026', risk: RiskLevel.medium, reason: 'Anaemia (Hb 9.2), age 34', next: 'Due today'),
      Beneficiary(id: 'b4', name: 'Abdullah', bn: 'আব্দুল্লাহ', months: 9, type: BeneficiaryType.child, village: 'Char Bhola', code: 'CH-1182', risk: RiskLevel.high, reason: 'MUAC 11.2 cm — SAM', muac: 11.2, next: 'Due today'),
      Beneficiary(id: 'b2', name: 'Shefali Khatun', bn: 'শেফালী খাতুন', age: 26, type: BeneficiaryType.anc, weeks: 18, village: 'Madhupur', code: 'ANC-2447', anc: 2, edd: '30 Oct 2026', risk: RiskLevel.low, next: '10 Jul'),
      Beneficiary(id: 'b5', name: 'Nasima Akter', bn: 'নাসিমা আক্তার', age: 22, type: BeneficiaryType.pnc, village: 'Madhupur', code: 'PNC-0912', risk: RiskLevel.low, day: 3, next: '12 Jul'),
      Beneficiary(id: 'b6', name: 'Fatema', bn: 'ফাতেমা', months: 14, type: BeneficiaryType.child, village: 'Uttar Para', code: 'CH-1175', risk: RiskLevel.low, next: '18 Jul'),
      Beneficiary(id: 'b7', name: 'Tania Akter', bn: 'তানিয়া আক্তার', age: 14, type: BeneficiaryType.adolescent, village: 'Char Bhola', code: 'ADO-0571', risk: RiskLevel.medium, reason: 'Anaemia screening due', next: 'Due today'),
      Beneficiary(id: 'b8', name: 'Abdul Karim', bn: 'আব্দুল করিম', age: 68, type: BeneficiaryType.elderly, village: 'Madhupur', code: 'ELD-0233', risk: RiskLevel.high, reason: 'Hypertension — uncontrolled BP', next: 'Due today'),
      Beneficiary(id: 'b9', name: 'Jamal Hossain', bn: 'জামাল হোসেন', age: 31, type: BeneficiaryType.disabled, village: 'Uttar Para', code: 'PWD-0118', risk: RiskLevel.medium, reason: 'Mobility impairment — home visit', next: '15 Jul'),
    ];

List<Worker> seedWorkers() => [
      Worker(id: 'w1', name: 'Rokeya Sultana', role: WorkerRole.fwa, union: 'Char Bhola', assigned: 142, high: 6, visits: 118, cov: 71, lastSync: '2 days ago', status: OnlineStatus.offline),
      Worker(id: 'w2', name: 'Shahnaz Pervin', role: WorkerRole.fwa, union: 'Madhupur', assigned: 128, high: 3, visits: 104, cov: 78, lastSync: '09:05 today', status: OnlineStatus.online),
      Worker(id: 'w3', name: 'Anwara Khatun', role: WorkerRole.fwv, union: 'Uttar Para', assigned: 96, high: 2, visits: 71, cov: 64, lastSync: '08:40 today', status: OnlineStatus.online),
      Worker(id: 'w4', name: 'Hasna Hena', role: WorkerRole.chcp, union: 'Char Bhola', assigned: 110, high: 4, visits: 92, cov: 58, lastSync: '1 day ago', status: OnlineStatus.offline),
      Worker(id: 'w5', name: 'Mukti Rani', role: WorkerRole.fwa, union: 'Dakshin', assigned: 134, high: 5, visits: 121, cov: 83, lastSync: '09:11 today', status: OnlineStatus.online),
    ];

/// Backlog so the offline banner shows "7 records pending sync" on first launch.
List<SyncQueueItem> seedBacklog() {
  final now = DateTime.now().millisecondsSinceEpoch;
  const labels = [
    'ANC visit · Rahima Begum',
    'ANC visit · Morjina Begum',
    'Child assessment · Abdullah',
    'Registration · Tania Akter',
    'PNC visit · Nasima Akter',
    'Danger sign flag · Abdul Karim',
    'Home visit · Jamal Hossain',
  ];
  return [
    for (var i = 0; i < labels.length; i++)
      SyncQueueItem(kind: 'visit', refId: 'seed-$i', label: labels[i], createdAt: now - (labels.length - i) * 3600000),
  ];
}

class CurrentOfficer {
  static const name = 'রোকেয়া সুলতানা';
  static const nameEn = 'Rokeya Sultana';
  static const initials = 'RS';
  static const role = 'FWA';
  static const union = 'Char Bhola Union';
  static const username = 'rokeya.cb01';
}

class CurrentSupervisor {
  static const name = 'Dr. S. Rahman';
  static const upazila = 'Bhola Sadar Upazila';
  static const username = 's.rahman';
  static const scope = 'Bhola Sadar · 6 unions · 42 field officers';
}

const List<String> kUnions = ['Char Bhola', 'Madhupur', 'Uttar Para', 'Dakshin', 'Purba Para'];
const List<WorkerRole> kRoles = [WorkerRole.fwa, WorkerRole.fwv, WorkerRole.chcp, WorkerRole.ha];
