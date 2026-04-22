"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type ChatSessionStatus = "open" | "closed";

type ChatMessage = {
  id: string;
  sender: "visitor" | "admin";
  body: string;
  createdAt: string;
};

type ChatSessionSummary = {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: ChatSessionStatus;
  unreadForAdmin: boolean;
  unreadForVisitor: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  lastMessagePreview: string;
};

type ChatSessionDetails = {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: ChatSessionStatus;
  unreadForAdmin: boolean;
  unreadForVisitor: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  messages: ChatMessage[];
};

type Props = {
  initialSessions: ChatSessionSummary[];
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminChatManager({ initialSessions }: Props) {
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedId, setSelectedId] = useState<string | null>(initialSessions[0]?.id ?? null);
  const [activeSession, setActiveSession] = useState<ChatSessionDetails | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sessionCountLabel = useMemo(() => {
    const unread = sessions.filter((session) => session.unreadForAdmin).length;
    return unread > 0 ? `${sessions.length} chats, ${unread} unread` : `${sessions.length} chats`;
  }, [sessions]);

  const request = useCallback(async (url: string, options: RequestInit = {}) => {
    const response = await apiFetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (response.status === 401) {
      throw new Error("Your admin session has expired. Please sign in again.");
    }

    return response;
  }, []);

  const reloadSessions = useCallback(async () => {
    const response = await request("/api/admin/chat/sessions");
    if (!response.ok) {
      throw new Error("Failed to load chats.");
    }

    const data = (await response.json()) as { sessions: ChatSessionSummary[] };
    setSessions(data.sessions);

    if (!data.sessions.length) {
      setSelectedId(null);
      setActiveSession(null);
      return;
    }

    setSelectedId((currentSelectedId) => {
      const selectionStillExists = currentSelectedId
        ? data.sessions.some((session) => session.id === currentSelectedId)
        : false;
      return selectionStillExists ? currentSelectedId : data.sessions[0].id;
    });
  }, [request]);

  const loadSession = useCallback(async (sessionId: string) => {
    const response = await request(`/api/admin/chat/sessions/${sessionId}`);
    if (!response.ok) {
      throw new Error("Failed to load the selected chat.");
    }

    const data = (await response.json()) as { session: ChatSessionDetails };
    setActiveSession(data.session);
  }, [request]);

  useEffect(() => {
    void reloadSessions().catch((error: unknown) => {
      setStatus(error instanceof Error ? error.message : "Failed to load chats.");
    });

    const interval = window.setInterval(() => {
      void reloadSessions().catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Failed to load chats.");
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [reloadSessions]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    void loadSession(selectedId)
      .then(() => reloadSessions())
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Failed to load the selected chat.");
      });

    const interval = window.setInterval(() => {
      void loadSession(selectedId)
        .then(() => reloadSessions())
        .catch((error: unknown) => {
          setStatus(error instanceof Error ? error.message : "Failed to load the selected chat.");
        });
    }, 4000);

    return () => window.clearInterval(interval);
  }, [loadSession, reloadSessions, selectedId]);

  const sendReply = async () => {
    if (!selectedId || !replyDraft.trim()) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await request(`/api/admin/chat/sessions/${selectedId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: replyDraft }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || "Failed to send reply.");
      }

      setReplyDraft("");
      await Promise.all([reloadSessions(), loadSession(selectedId)]);
      setStatus("Reply emailed to the visitor.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to send reply.");
    } finally {
      setLoading(false);
    }
  };

  const toggleChatStatus = async () => {
    if (!activeSession) {
      return;
    }

    setLoading(true);
    setStatus(null);

    const nextStatus: ChatSessionStatus = activeSession.status === "open" ? "closed" : "open";

    try {
      const response = await request(`/api/admin/chat/sessions/${activeSession.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || "Failed to update chat status.");
      }

      await Promise.all([reloadSessions(), loadSession(activeSession.id)]);
      setStatus(nextStatus === "closed" ? "Chat closed." : "Chat reopened.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to update chat status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">Chat Inbox</h2>
            <p className="mt-2 text-sm text-slate-600">{sessionCountLabel}</p>
          </div>
          <button
            type="button"
            onClick={() =>
              void reloadSessions()
                .then(() => setStatus("Chats refreshed."))
                .catch((error: unknown) =>
                  setStatus(error instanceof Error ? error.message : "Failed to reload chats."),
                )
            }
            className="rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {sessions.length ? (
            sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  setSelectedId(session.id);
                  setStatus(null);
                }}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedId === session.id
                    ? "border-[var(--avlc-primary)] bg-[rgba(8,193,243,0.10)]"
                    : "border-[var(--avlc-slate-200)] bg-slate-50 hover:border-[var(--avlc-primary)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--avlc-navy-900)]">{session.visitorName}</p>
                    <p className="text-xs text-slate-500">{session.visitorEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.unreadForAdmin ? (
                      <span className="rounded-full bg-[var(--avlc-primary)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--avlc-navy-900)]">
                        New
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                        session.status === "open"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{session.lastMessagePreview}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                  Last activity {formatDateTime(session.lastMessageAt)}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--avlc-slate-200)] bg-slate-50 p-6">
              <p className="text-sm text-slate-600">No chat conversations yet. New visitor messages will appear here.</p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        {activeSession ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">
                  Active Conversation
                </p>
                <h2 className="mt-2 text-2xl text-[var(--avlc-navy-900)]">{activeSession.visitorName}</h2>
                <p className="mt-1 text-sm text-slate-600">{activeSession.visitorEmail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                  Started {formatDateTime(activeSession.createdAt)}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Replies from this panel are delivered to the visitor by email.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] ${
                    activeSession.status === "open"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {activeSession.status === "open" ? "Open chat" : "Closed chat"}
                </span>
                <button
                  type="button"
                  onClick={() => void toggleChatStatus()}
                  disabled={loading}
                  className="rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:opacity-60"
                >
                  {activeSession.status === "open" ? "Close Chat" : "Reopen Chat"}
                </button>
              </div>
            </div>

            <div className="mt-6 max-h-[520px] space-y-3 overflow-y-auto rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-4">
              {activeSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.sender === "admin"
                      ? "ml-auto bg-[var(--avlc-primary)] text-[var(--avlc-navy-900)]"
                      : "bg-white text-slate-700"
                  }`}
                >
                  <p className="font-semibold">{message.sender === "admin" ? "Admin reply" : "Visitor message"}</p>
                  <p>{message.body}</p>
                  <p className="mt-1 text-xs opacity-80">{formatDateTime(message.createdAt)}</p>
                </div>
              ))}
            </div>

            {activeSession.status === "open" ? (
              <div className="mt-6 space-y-3">
                <textarea
                  value={replyDraft}
                  onChange={(event) => setReplyDraft(event.target.value)}
                  placeholder="Write the email reply you want the visitor to receive"
                  rows={4}
                  className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => void sendReply()}
                  disabled={loading || !replyDraft.trim()}
                  className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Email Reply"}
                </button>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-600">
                This conversation is closed. Reopen it if you want to continue chatting with the visitor.
              </p>
            )}
          </>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[var(--avlc-slate-200)] bg-slate-50 p-8 text-center">
            <div>
              <h2 className="text-2xl text-[var(--avlc-navy-900)]">Select a chat to manage it</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                When visitors start a conversation from the Contact page, it will appear here with its message thread.
              </p>
            </div>
          </div>
        )}

        {status ? <p className="mt-4 text-sm text-slate-700">{status}</p> : null}
      </section>
    </div>
  );
}


