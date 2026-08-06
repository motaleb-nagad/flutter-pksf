import 'package:flutter_test/flutter_test.dart';
import 'package:mch_surveillance/domain/models.dart';
import 'package:mch_surveillance/domain/nutrition.dart';
import 'package:mch_surveillance/domain/risk.dart';

AncVisit _healthy() => AncVisit(sbp: 118, dbp: 76, weight: 58, hb: 12, fundal: 30, fhr: 140);

void main() {
  group('computeAncRisk', () {
    test('healthy vitals are low risk', () {
      final r = computeAncRisk(_healthy());
      expect(r.level, RiskLevel.low);
      expect(r.reasons, isEmpty);
    });

    test('any danger sign forces high', () {
      final v = _healthy()..danger.bleeding = true;
      final r = computeAncRisk(v);
      expect(r.level, RiskLevel.high);
      expect(r.reasons, contains('Vaginal bleeding'));
    });

    test('raised blood pressure is high', () {
      final v = _healthy()
        ..sbp = 150
        ..dbp = 95;
      expect(computeAncRisk(v).level, RiskLevel.high);
    });

    test('borderline blood pressure is medium', () {
      final v = _healthy()
        ..sbp = 132
        ..dbp = 86;
      expect(computeAncRisk(v).level, RiskLevel.medium);
    });

    test('anaemia grades by haemoglobin', () {
      expect(computeAncRisk(_healthy()..hb = 9.2).level, RiskLevel.medium);
      expect(computeAncRisk(_healthy()..hb = 6.5).level, RiskLevel.high);
    });

    test('abnormal fetal heart rate is high', () {
      expect(computeAncRisk(_healthy()..fhr = 110).level, RiskLevel.high);
    });
  });

  group('classifyMuac', () {
    test('low MUAC is SAM', () => expect(classifyMuac(11.2, false).short, 'SAM'));
    test('oedema alone is SAM', () => expect(classifyMuac(13.0, true).short, 'SAM'));
    test('mid-range MUAC is MAM', () => expect(classifyMuac(12.0, false).short, 'MAM'));
    test('healthy MUAC is normal', () => expect(classifyMuac(13.5, false).short, 'Normal'));
  });
}
