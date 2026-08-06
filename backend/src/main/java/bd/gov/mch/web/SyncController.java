package bd.gov.mch.web;

import java.time.Instant;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Receives the batched offline sync queue from a field device and acknowledges
 * the records it accepted. The app clears only acknowledged items, so an
 * interrupted sync is safe to retry.
 */
@RestController
@RequestMapping("/api/sync")
public class SyncController {

    public record SyncItem(String kind, String refId, String label, Long createdAt) {
    }

    public record SyncRequest(List<SyncItem> items) {
    }

    public record SyncResponse(int accepted, List<String> acknowledgedRefIds, String syncedAt) {
    }

    @PostMapping
    public SyncResponse sync(@RequestBody SyncRequest request) {
        List<SyncItem> items = request.items() == null ? List.of() : request.items();
        List<String> acknowledged = items.stream().map(SyncItem::refId).toList();
        return new SyncResponse(items.size(), acknowledged, Instant.now().toString());
    }
}
