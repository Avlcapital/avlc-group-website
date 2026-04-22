"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UpdateItem } from "@/lib/updates-schema";
import {
  getFallbackRefreshMessage,
  shouldRefreshUpdates,
} from "@/lib/live-updates-client";
import { apiFetch } from "@/lib/api-client";

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

const updateTypes = ["All", "Announcement", "Partnership", "Tender", "Product Launch", "Compliance"] as const;
type UpdateTypeFilter = (typeof updateTypes)[number];

function badgeStyles(type: UpdateItem["type"]): string {
  if (type === "Tender") {
    return "bg-amber-100 text-amber-900 border-amber-200";
  }
  if (type === "Partnership") {
    return "bg-emerald-100 text-emerald-900 border-emerald-200";
  }
  if (type === "Product Launch") {
    return "bg-cyan-100 text-cyan-900 border-cyan-200";
  }
  if (type === "Compliance") {
    return "bg-slate-200 text-slate-800 border-slate-300";
  }
  return "bg-[color-mix(in_srgb,var(--avlc-gold-300)_35%,white)] text-[var(--avlc-navy-900)] border-[var(--avlc-gold-300)]";
}

export default function LiveUpdatesPanel({ initialUpdates, initialVersion }: Props) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [version, setVersion] = useState(initialVersion);
  const [connectedLive, setConnectedLive] = useState(true);
  const [liveNotice, setLiveNotice] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<UpdateTypeFilter>("All");

  useEffect(() => {
    let isActive = true;

    const poll = async () => {
      try {
        const response = await apiFetch("/api/updates", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Refresh failed (${response.status})`);
        }

        const data = (await response.json()) as UpdatesResponse;
        if (!isActive) {
          return;
        }

        setFallbackNotice(null);
        setConnectedLive(true);

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
        setConnectedLive(false);
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

  const normalizedQuery = query.trim().toLowerCase();
  const filteredUpdates = updates.filter((item) => {
    if (typeFilter !== "All" && item.type !== typeFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      item.title,
      item.summary,
      item.type,
      item.source,
      item.status,
      item.location || "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--avlc-navy-900)]">Live Feed Controls</p>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
              connectedLive
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {connectedLive ? "Connected Live" : "Fallback Refresh"}
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search updates by title, source, type, or location"
            className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
            aria-label="Search updates"
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as UpdateTypeFilter)}
            className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
            aria-label="Filter by update type"
          >
            {updateTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <p aria-live="polite" className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          Showing {filteredUpdates.length} of {updates.length} updates
        </p>
      </div>

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

      {filteredUpdates.length === 0 ? (
        <div aria-live="polite" className="rounded-lg border border-zinc-200 bg-white p-6 text-zinc-600">
          No updates match your current filters. Try clearing search or selecting another update type.
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredUpdates.map((item) => (
            <li key={item.id} className="rounded-xl border border-[var(--avlc-slate-200)] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeStyles(item.type)}`}>
                  {item.type}
                </span>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {item.status}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{item.source}</span>
                {item.location ? (
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">· {item.location}</span>
                ) : null}
              </div>
              <time
                dateTime={item.publishedAt}
                className="mt-3 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
              >
                {formatDate(item.publishedAt)}
              </time>
              <h2 className="mt-2 text-2xl text-[var(--avlc-navy-900)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {item.documentUrl ? (
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:brightness-95"
                  >
                    Download Document
                  </a>
                ) : null}

                {item.externalUrl ? (
                  item.externalUrl.startsWith("/") ? (
                    <Link
                      href={item.externalUrl}
                      className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
                    >
                      View Details
                    </Link>
                  ) : (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
                    >
                      View Source
                    </a>
                  )
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
