"use client";

import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api-client";

type AdminRole = "super_admin" | "editor";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CurrentAdmin = {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
};

type AdminUsersResponse = {
  currentAdmin: CurrentAdmin;
  users: AdminUser[];
};

type ComposerMode = "create" | "edit" | null;

function formatDateTime(value: string) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsersManager() {
  const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [composerMode, setComposerMode] = useState<ComposerMode>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (url: string, options: RequestInit = {}) => {
    return apiFetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  }, []);

  const reload = useCallback(async () => {
    const response = await request("/api/admin/users");
    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(error.error || "Failed to load admin users.");
    }

    const data = (await response.json()) as AdminUsersResponse;
    setCurrentAdmin(data.currentAdmin);
    setUsers(data.users);
  }, [request]);

  useEffect(() => {
    queueMicrotask(() => {
      void reload().catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Failed to load admin users.");
      });
    });
  }, [reload]);

  const resetComposerState = useCallback(() => {
    setSelectedUser(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("editor");
    setIsActive(true);
  }, []);

  const openCreator = useCallback(() => {
    setStatus(null);
    resetComposerState();
    setComposerMode("create");
  }, [resetComposerState]);

  const openEditor = useCallback((user: AdminUser) => {
    setStatus(null);
    setSelectedUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
    setIsActive(user.isActive);
    setComposerMode("edit");
  }, []);

  const closeComposer = useCallback(() => {
    resetComposerState();
    setComposerMode(null);
  }, [resetComposerState]);

  const onCreateAdmin = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await request("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || "Failed to create admin user.");
      }

      closeComposer();
      await reload();
      setStatus("Admin user created successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to create admin user.");
    } finally {
      setLoading(false);
    }
  };

  const onSaveAdmin = async () => {
    if (!selectedUser) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await request(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          isActive,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || "Failed to update admin user.");
      }

      closeComposer();
      await reload();
      setStatus("Admin user updated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to update admin user.");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAdmin = async (user: AdminUser) => {
    const confirmed = window.confirm(`Delete admin user '${user.username}'? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await request(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || "Failed to delete admin user.");
      }

      if (selectedUser?.id === user.id) {
        closeComposer();
      }
      await reload();
      setStatus("Admin user deleted successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to delete admin user.");
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = currentAdmin?.role === "super_admin";

  useEffect(() => {
    if (!composerMode) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeComposer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeComposer, composerMode]);

  const isEditing = composerMode === "edit";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">Admin Accounts</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Review who has access to the admin area and create additional admin accounts when needed.
            </p>
            {currentAdmin ? (
              <p className="mt-3 text-sm text-slate-700">
                Signed in as <span className="font-semibold">{currentAdmin.username}</span> ({currentAdmin.role}).
                {currentAdmin.email ? ` Notifications go to ${currentAdmin.email}.` : ""}
              </p>
            ) : null}
            {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}
          </div>
          <button
            type="button"
            onClick={() =>
              void reload()
                .then(() => setStatus("Admin users refreshed."))
                .catch((error: unknown) =>
                  setStatus(error instanceof Error ? error.message : "Failed to refresh admin users."),
                )
            }
            className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
          >
            Refresh
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">Access Control</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Create new admin accounts from a popout form, then return straight to the table for review.
            </p>
            {!isSuperAdmin ? (
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Only super admins can create, edit, or delete admin users. You can still review the existing admin
                accounts below.
              </p>
            ) : null}
          </div>
          {isSuperAdmin ? (
            <button
              type="button"
              onClick={openCreator}
              className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
            >
              Create Admin
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl text-[var(--avlc-navy-900)]">Existing Admins</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--avlc-slate-200)]">
          {users.length ? (
            <table className="min-w-full divide-y divide-[var(--avlc-slate-200)] bg-white text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Updated</th>
                  {isSuperAdmin ? <th className="px-4 py-3">Actions</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--avlc-slate-200)]">
                {users.map((user) => {
                  const isCurrentAdmin = currentAdmin?.id === user.id;

                  return (
                    <tr key={user.id} className={isCurrentAdmin ? "bg-[rgba(8,193,243,0.08)]" : "bg-white"}>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[var(--avlc-navy-900)]">{user.username}</span>
                          {isCurrentAdmin ? (
                            <span className="rounded-full bg-[var(--avlc-primary)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--avlc-navy-900)]">
                              You
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.email || "Not set"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.role}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.isActive ? "Active" : "Inactive"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDateTime(user.createdAt)}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDateTime(user.updatedAt)}</td>
                      {isSuperAdmin ? (
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditor(user)}
                              className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--avlc-navy-900)]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void onDeleteAdmin(user)}
                              disabled={loading || isCurrentAdmin}
                              className="inline-flex rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="border-dashed bg-slate-50 p-6">
              <p className="text-sm text-slate-600">No admin users found yet.</p>
            </div>
          )}
        </div>
      </section>

      {composerMode ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-4"
          onClick={closeComposer}
        >
          <section
            className="w-full max-w-2xl rounded-[28px] border border-[var(--avlc-slate-200)] bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Access</p>
                <h2 className="mt-2 text-3xl text-[var(--avlc-navy-900)]">
                  {isEditing ? "Edit Admin" : "Create Admin"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {isEditing
                    ? "Update the username, role, active status, or password for this admin account."
                    : "Add a new admin account and assign the correct permission level before sharing credentials."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeComposer}
                className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isEditing ? "New password (optional)" : "Password"}
                className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
              />
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as AdminRole)}
                className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
              >
                <option value="editor">Editor</option>
                <option value="super_admin">Super Admin</option>
              </select>
              {isEditing ? (
                <label className="inline-flex items-center gap-2 rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                  />
                  Active account
                </label>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void (isEditing ? onSaveAdmin() : onCreateAdmin())}
                disabled={loading}
                className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:opacity-60"
              >
                {loading ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save Changes" : "Add Admin"}
              </button>
              <button
                type="button"
                onClick={closeComposer}
                className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
              >
                Cancel
              </button>
            </div>
            {status ? <p className="mt-4 text-sm text-slate-700">{status}</p> : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}
