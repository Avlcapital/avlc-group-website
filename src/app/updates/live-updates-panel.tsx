"use client";

import { useEffect, useState } from "react";
import type { UpdateItem } from "@/lib/updates";
import {
  getFallbackRefreshMessage,
  shouldRefreshUpdates,
} from "@/lib/live-updates-client";

type Props = {
  initialUpdates: UpdateItem[];
  initialVersion: string;
};

type UpdatesResponse = {
  updates: UpdateItem[];
  version: string;
};

function formatDate(dateIso: string): string {
  return new Date(`${dateIso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function LiveUpdatesPanel({ initialUpdates, initialVersion }: Props) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [version, setVersion] = useState(initialVersion);
  const [liveNotice, setLiveNotice] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const poll = async () => {
      try {
        const response = await fetch("/api/updates", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Refresh failed (${response.status})`);
        }

        const data = (await response.json()) as UpdatesResponse;
        if (!isActive) {
          return;
        }

        setFallbackNotice(null);

        if (shouldRefreshUpdates(version, data.version)) {
          setUpdates(data.updates);
          setVersion(data.version);
          setLiveNotice("New announcements were published. The list has been refreshed.");
          window.setTimeout(() => {
            if (isActive) {
              setLiveNotice(null);
            }
          }, 3500);
        }
      } catch {
        if (!isActive) {
          return;
        }
        setFallbackNotice(getFallbackRefreshMessage());
      }
    };

    void poll();
    const intervalId = window.setInterval(poll, 5000);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [version]);

  return (
    <>
      {liveNotice ? (
        <div aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          {liveNotice}
        </div>
      ) : null}

      {fallbackNotice ? (
        <div aria-live="polite" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          {fallbackNotice}
        </div>
      ) : null}

      {updates.length === 0 ? (
        <div aria-live="polite" className="rounded-lg border border-zinc-200 bg-white p-6 text-zinc-600">
          No updates are available yet. Please check back soon.
        </div>
      ) : (
        <ul className="space-y-3">
          {updates.map((item) => (
            <li key={item.id} className="rounded-lg border border-zinc-200 bg-white p-5">
              <time
                dateTime={item.publishedAt}
                className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
              >
                {formatDate(item.publishedAt)}
              </time>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-2 text-zinc-600">{item.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
