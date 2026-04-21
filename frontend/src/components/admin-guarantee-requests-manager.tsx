"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type GuaranteeRequestStatus = "new" | "reviewing" | "completed";

type GuaranteeRequest = {
  id: string;
  applicantName: string;
  registrationNumber?: string;
  kraPin?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  physicalAddress?: string;
  guaranteeType: string;
  guaranteeAmount: string;
  currency: string;
  beneficiaryName: string;
  beneficiaryAddress?: string;
  tenderNumber?: string;
  tenderTitle: string;
  tenderClosingDate?: string;
  guaranteeStartDate?: string;
  guaranteeEndDate: string;
  purpose?: string;
  deliveryMode?: string;
  bankPreference?: string;
  additionalNotes?: string;
  supportingDocuments: Array<{ filename: string; contentType: string; size: number }>;
  status: GuaranteeRequestStatus;
  createdAt: string;
  updatedAt: string;
};

const statuses: GuaranteeRequestStatus[] = ["new", "reviewing", "completed"];

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminGuaranteeRequestsManager() {
  const [requests, setRequests] = useState<GuaranteeRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) || requests[0] || null,
    [requests, selectedId],
  );

  const reload = useCallback(async () => {
    const response = await apiFetch("/api/admin/guarantee-requests");
    if (!response.ok) {
      throw new Error(response.status === 401 ? "Please sign in to view guarantee requests." : "Failed to load requests.");
    }

    const data = (await response.json()) as { requests: GuaranteeRequest[] };
    setRequests(data.requests);
    setSelectedId((current) => {
      if (current && data.requests.some((item) => item.id === current)) {
        return current;
      }
      return data.requests[0]?.id ?? null;
    });
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void reload().catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Failed to load guarantee requests.");
      });
    });
  }, [reload]);

  const updateStatus = async (requestId: string, nextStatus: GuaranteeRequestStatus) => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await apiFetch(`/api/admin/guarantee-requests/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || "Failed to update request status.");
      }

      await reload();
      setStatus("Request status updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to update request status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">Requests</h2>
            <p className="mt-2 text-sm text-slate-600">{requests.length} guarantee requests</p>
          </div>
          <button
            type="button"
            onClick={() =>
              void reload()
                .then(() => setStatus("Guarantee requests refreshed."))
                .catch((error: unknown) =>
                  setStatus(error instanceof Error ? error.message : "Failed to reload requests."),
                )
            }
            className="rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {requests.length ? (
            requests.map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => setSelectedId(request.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedRequest?.id === request.id
                    ? "border-[var(--avlc-primary)] bg-[rgba(8,193,243,0.10)]"
                    : "border-[var(--avlc-slate-200)] bg-slate-50 hover:border-[var(--avlc-primary)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--avlc-navy-900)]">{request.applicantName}</p>
                    <p className="text-xs text-slate-500">{request.guaranteeType}</p>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                    {request.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {request.currency} {request.guaranteeAmount} for {request.beneficiaryName}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                  Submitted {formatDate(request.createdAt)}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--avlc-slate-200)] bg-slate-50 p-6">
              <p className="text-sm text-slate-600">No guarantee requests yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        {selectedRequest ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">
                  Guarantee Request
                </p>
                <h2 className="mt-2 text-2xl text-[var(--avlc-navy-900)]">{selectedRequest.applicantName}</h2>
                <p className="mt-1 text-sm text-slate-600">Submitted {formatDate(selectedRequest.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void updateStatus(selectedRequest.id, item)}
                    disabled={loading || selectedRequest.status === item}
                    className="rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:opacity-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <DetailGrid
              items={[
                ["Contact Person", selectedRequest.contactPerson],
                ["Email", selectedRequest.contactEmail],
                ["Phone", selectedRequest.contactPhone],
                ["Registration No.", selectedRequest.registrationNumber],
                ["KRA PIN", selectedRequest.kraPin],
                ["Address", selectedRequest.physicalAddress],
              ]}
            />

            <DetailGrid
              title="Guarantee Details"
              items={[
                ["Type", selectedRequest.guaranteeType],
                ["Amount", `${selectedRequest.currency} ${selectedRequest.guaranteeAmount}`],
                ["Beneficiary", selectedRequest.beneficiaryName],
                ["Beneficiary Address", selectedRequest.beneficiaryAddress],
                ["Tender No.", selectedRequest.tenderNumber],
                ["Tender / Project", selectedRequest.tenderTitle],
                ["Tender Closing", selectedRequest.tenderClosingDate],
                ["Start Date", selectedRequest.guaranteeStartDate],
                ["Expiry Date", selectedRequest.guaranteeEndDate],
                ["Delivery Mode", selectedRequest.deliveryMode],
                ["Preferred Bank / Issuer", selectedRequest.bankPreference],
              ]}
            />

            <div className="rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-4">
              <h3 className="text-lg font-semibold text-[var(--avlc-navy-900)]">Instructions and Notes</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {selectedRequest.purpose || "No purpose provided."}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {selectedRequest.additionalNotes || "No additional notes."}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-4">
              <h3 className="text-lg font-semibold text-[var(--avlc-navy-900)]">Supporting Documents</h3>
              {selectedRequest.supportingDocuments.length ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedRequest.supportingDocuments.map((file) => (
                    <li key={`${file.filename}-${file.size}`}>
                      {file.filename} · {file.contentType} · {formatBytes(file.size)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600">No supporting documents uploaded.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--avlc-slate-200)] bg-slate-50 p-8 text-center">
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">Select a request</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Submitted PSL guarantee requests will appear here.</p>
          </div>
        )}

        {status ? <p className="mt-4 text-sm text-slate-700">{status}</p> : null}
      </section>
    </div>
  );
}

function DetailGrid({
  title = "Applicant Details",
  items,
}: {
  title?: string;
  items: Array<[string, string | undefined]>;
}) {
  return (
    <div className="rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-4">
      <h3 className="text-lg font-semibold text-[var(--avlc-navy-900)]">{title}</h3>
      <dl className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm text-slate-700">{value || "Not provided"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
