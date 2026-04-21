import LiveUpdatesPanel from "./live-updates-panel";
import { apiUrl } from "@/lib/api-client";
import type { UpdateItem } from "@/lib/updates-schema";

export default async function UpdatesPage() {
  const payload = await loadUpdatesPayload();

  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Updates</p>
        <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">Update Timeline Feed</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          Track announcements, partnerships, tender notices, and product milestones in one live feed. The stream refreshes
          automatically and supports quick filtering by type, location, and keywords.
        </p>
      </header>

      <LiveUpdatesPanel initialUpdates={payload.updates} initialVersion={payload.version} />
    </section>
  );
}

async function loadUpdatesPayload(): Promise<{ updates: UpdateItem[]; version: string }> {
  try {
    const response = await fetch(apiUrl("/api/updates"), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load updates");
    }
    return (await response.json()) as { updates: UpdateItem[]; version: string };
  } catch {
    return { updates: [], version: "unavailable" };
  }
}
