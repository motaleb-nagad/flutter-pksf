package bd.gov.mch.service;

import java.util.List;
import org.springframework.stereotype.Service;

/**
 * WHO &amp; Bangladesh MCH framework indicator readouts for the supervisor portal.
 * Each item is either a coverage metric (higher = better) or a burden metric
 * (higher = worse) — {@link FormatService#covColor} handles the inverted scale.
 * Ported from the field app's {@code indicators.ts}.
 */
@Service
public class IndicatorService {

    private final FormatService format;

    public IndicatorService(FormatService format) {
        this.format = format;
    }

    public record IndicatorItem(String name, String bn, int value, String valueLabel,
                                boolean burden, String color) {
    }

    public record IndicatorGroup(String group, String bn, List<IndicatorItem> items) {
    }

    private record Raw(String name, String bn, int value, boolean burden) {
        Raw(String name, String bn, int value) {
            this(name, bn, value, false);
        }
    }

    private record RawGroup(String group, String bn, List<Raw> items) {
    }

    private static final List<RawGroup> RAW = List.of(
            new RawGroup("Antenatal Care", "গর্ভকালীন সেবা", List.of(
                    new Raw("ANC 1st contact (1st trimester)", "১ম ত্রৈমাসিকে নিবন্ধন", 68),
                    new Raw("ANC 4+ contacts", "৪+ পরিদর্শন", 71),
                    new Raw("ANC 8 contacts (WHO 2016)", "৮টি পরিদর্শন", 22),
                    new Raw("TT / Td immunisation (2+ doses)", "টিটি টিকা", 89),
                    new Raw("IFA supplementation (180+ tabs)", "আয়রন-ফলিক", 64),
                    new Raw("Calcium supplementation", "ক্যালসিয়াম", 41),
                    new Raw("Blood pressure measured", "রক্তচাপ পরিমাপ", 93),
                    new Raw("Anaemia / Hb screening", "রক্তস্বল্পতা পরীক্ষা", 77),
                    new Raw("Syphilis tested", "সিফিলিস পরীক্ষা", 58),
                    new Raw("Ultrasound before 24 wk", "আল্ট্রাসনোগ্রাম", 39),
                    new Raw("Birth & complication plan", "প্রসব পরিকল্পনা", 61))),
            new RawGroup("Delivery & Birth", "প্রসব ও জন্ম", List.of(
                    new Raw("Skilled birth attendant", "দক্ষ ধাত্রী", 63),
                    new Raw("Facility delivery", "প্রতিষ্ঠানে প্রসব", 57),
                    new Raw("Early breastfeeding (<1 hr)", "দ্রুত বুকের দুধ", 66),
                    new Raw("Chlorhexidine cord care", "নাড়ি পরিচর্যা", 72),
                    new Raw("KMC for LBW / preterm", "ক্যাঙ্গারু কেয়ার", 34),
                    new Raw("Low birth weight (<2.5 kg)", "কম ওজনে জন্ম", 18, true),
                    new Raw("Caesarean section rate", "সিজার", 28, true))),
            new RawGroup("Postnatal Care", "প্রসব-পরবর্তী সেবা", List.of(
                    new Raw("PNC mother within 48 hr", "মায়ের পিএনসি", 58),
                    new Raw("PNC newborn within 48 hr", "নবজাতকের পিএনসি", 55),
                    new Raw("PNC 4 visits complete", "৪টি পিএনসি", 31),
                    new Raw("Family planning counselling", "পরিবার পরিকল্পনা পরামর্শ", 49))),
            new RawGroup("Immunisation (EPI)", "টিকাদান", List.of(
                    new Raw("BCG", "বিসিজি", 97),
                    new Raw("Pentavalent 3", "পেন্টা-৩", 88),
                    new Raw("PCV 3", "পিসিভি-৩", 86),
                    new Raw("OPV 3", "ওপিভি-৩", 87),
                    new Raw("IPV", "আইপিভি", 79),
                    new Raw("MR 1", "এমআর-১", 85),
                    new Raw("MR 2", "এমআর-২", 72),
                    new Raw("Fully immunised by 1 yr", "সম্পূর্ণ টিকা", 84))),
            new RawGroup("Child Growth & Nutrition", "শিশু পুষ্টি", List.of(
                    new Raw("Monthly growth monitoring", "বৃদ্ধি পর্যবেক্ষণ", 67),
                    new Raw("Exclusive breastfeeding <6 mo", "একচেটিয়া বুকের দুধ", 65),
                    new Raw("Minimum acceptable diet", "গ্রহণযোগ্য খাদ্য", 34),
                    new Raw("Vitamin A (6–59 mo)", "ভিটামিন এ", 88),
                    new Raw("Deworming", "কৃমিনাশক", 81),
                    new Raw("Stunting (HAZ < −2)", "খর্বকায়", 28, true),
                    new Raw("Wasting (WHZ < −2)", "কৃশকায়", 9, true),
                    new Raw("Underweight (WAZ < −2)", "কম ওজন", 22, true))),
            new RawGroup("Family Planning", "পরিবার পরিকল্পনা", List.of(
                    new Raw("Modern method use", "আধুনিক পদ্ধতি", 54),
                    new Raw("Postpartum family planning", "প্রসব-পরবর্তী", 38),
                    new Raw("Unmet need", "অপূর্ণ চাহিদা", 12, true))));

    public List<IndicatorGroup> indicatorGroups() {
        return RAW.stream()
                .map(g -> new IndicatorGroup(g.group(), g.bn(), g.items().stream()
                        .map(it -> new IndicatorItem(
                                it.name(), it.bn(), it.value(), it.value() + "%",
                                it.burden(), format.covColor(it.value(), it.burden())))
                        .toList()))
                .toList();
    }
}
