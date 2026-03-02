import LiveUpdatesPanel from "./live-updates-panel";
import { getUpdatesPayload } from "@/lib/updates";

export default function UpdatesPage() {
  const payload = getUpdatesPayload();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Updates</p>
        <h1 className="text-3xl font-semibold tracking-tight">Latest Announcements</h1>
        <p className="text-zinc-600">Updates are shown in reverse chronological order and refresh automatically.</p>
      </header>

      <LiveUpdatesPanel initialUpdates={payload.updates} initialVersion={payload.version} />
    </section>
  );
}
