"use client";

import { useMemo, useState } from "react";

import {
  UPDATE_STATUSES,
  UPDATE_TYPES,
  type UpdateStatus,
  type UpdateType,
  type UpdateInput,
  type UpdateItem,
} from "@/lib/updates-schema";

type Props = {
  initialUpdates: UpdateItem[];
};

const blankDraft: UpdateInput = {
  title: "",
  summary: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  type: "Announcement",
  source: "",
  status: "New",
  isPublished: false,
  location: "",
  documentUrl: "",
  externalUrl: "",
};

function normalizeDraft(draft: UpdateInput): UpdateInput {
  return {
    ...draft,
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    source: draft.source.trim(),
    location: draft.location?.trim() || undefined,
    documentUrl: draft.documentUrl?.trim() || undefined,
    externalUrl: draft.externalUrl?.trim() || undefined,
  };
}

export default function AdminUpdatesManager({ initialUpdates }: Props) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [draft, setDraft] = useState<UpdateInput>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sortedUpdates = useMemo(
    () =>
      [...updates].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [updates],
  );

  const request = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  };

  const reload = async () => {
    const response = await request("/api/admin/updates");
    if (!response.ok) {
      throw new Error("Failed to load updates.");
    }
    const data = (await response.json()) as { updates: UpdateItem[] };
    setUpdates(data.updates);
  };

  const save = async () => {
    const payload = normalizeDraft(draft);
    if (!payload.title || !payload.summary || !payload.source || !payload.publishedAt) {
      setStatus("Title, summary, source, and published date are required.");
      return;
    }

    setLoading(true);
    setStatus(null);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/updates/${editingId}` : "/api/admin/updates";
    const response = await request(url, {
      method,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(error.error || "Failed to save update.");
      setLoading(false);
      return;
    }

    await reload();
    setDraft(blankDraft);
    setEditingId(null);
    setStatus(editingId ? "Update edited successfully." : "Update created successfully.");
    setLoading(false);
  };

  const remove = async (id: string) => {
    setLoading(true);
    setStatus(null);
    const response = await request(`/api/admin/updates/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(error.error || "Failed to delete update.");
      setLoading(false);
      return;
    }
    await reload();
    if (editingId === id) {
      setEditingId(null);
      setDraft(blankDraft);
    }
    setStatus("Update deleted.");
    setLoading(false);
  };

  const togglePublish = async (item: UpdateItem) => {
    setLoading(true);
    setStatus(null);

    const payload: UpdateInput = {
      id: item.id,
      title: item.title,
      summary: item.summary,
      publishedAt: item.publishedAt,
      type: item.type,
      source: item.source,
      status: item.status,
      isPublished: !item.isPublished,
      location: item.location,
      documentUrl: item.documentUrl,
      externalUrl: item.externalUrl,
    };

    const response = await request(`/api/admin/updates/${item.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(error.error || "Failed to update publish status.");
      setLoading(false);
      return;
    }

    await reload();
    setStatus(payload.isPublished ? "Update published." : "Update moved to draft.");
    setLoading(false);
  };

  const startEdit = (item: UpdateItem) => {
    setEditingId(item.id);
    setDraft({
      id: item.id,
      title: item.title,
      summary: item.summary,
      publishedAt: item.publishedAt,
      type: item.type,
      source: item.source,
      status: item.status,
      isPublished: item.isPublished,
      location: item.location || "",
      documentUrl: item.documentUrl || "",
      externalUrl: item.externalUrl || "",
    });
    setStatus(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl text-[var(--avlc-navy-900)]">{editingId ? "Edit Update" : "Create Update"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Title *"
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
          />
          <input
            value={draft.source}
            onChange={(event) => setDraft((prev) => ({ ...prev, source: event.target.value }))}
            placeholder="Source *"
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
          />
          <input
            type="date"
            value={draft.publishedAt}
            onChange={(event) => setDraft((prev) => ({ ...prev, publishedAt: event.target.value }))}
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
          />
          <input
            value={draft.location || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Location (optional)"
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
          />
          <select
            value={draft.type}
            onChange={(event) => setDraft((prev) => ({ ...prev, type: event.target.value as UpdateType }))}
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
          >
            {UPDATE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={draft.status}
            onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as UpdateStatus }))}
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
          >
            {UPDATE_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            value={draft.documentUrl || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, documentUrl: event.target.value }))}
            placeholder="Document URL (optional)"
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700 md:col-span-2"
          />
          <input
            value={draft.externalUrl || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, externalUrl: event.target.value }))}
            placeholder="Details URL (optional)"
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700 md:col-span-2"
          />
          <textarea
            value={draft.summary}
            onChange={(event) => setDraft((prev) => ({ ...prev, summary: event.target.value }))}
            placeholder="Summary *"
            rows={4}
            className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700 md:col-span-2"
          />
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={draft.isPublished}
              onChange={(event) => setDraft((prev) => ({ ...prev, isPublished: event.target.checked }))}
            />
            Publish immediately
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            disabled={loading}
            className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:opacity-60"
          >
            {loading ? "Saving..." : editingId ? "Save Changes" : "Create Update"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraft(blankDraft);
              }}
              className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
            >
              Cancel Edit
            </button>
          ) : null}
          <button
            type="button"
            onClick={() =>
              void reload()
                .then(() => setStatus("Updates reloaded."))
                .catch(() => setStatus("Session expired. Please sign in again."))
            }
            className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
          >
            Reload
          </button>
        </div>
        {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl text-[var(--avlc-navy-900)]">Existing Updates</h2>
        <ul className="mt-4 space-y-3">
          {sortedUpdates.map((item) => (
            <li key={item.id} className="rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {item.publishedAt} · {item.type} · {item.isPublished ? "Published" : "Draft"}
              </p>
              <h3 className="mt-1 text-xl text-[var(--avlc-navy-900)]">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{item.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void togglePublish(item)}
                  className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--avlc-navy-900)]"
                >
                  {item.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--avlc-navy-900)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void remove(item.id)}
                  className="inline-flex rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
