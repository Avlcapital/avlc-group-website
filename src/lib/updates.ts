export type UpdateItem = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string; // ISO date string
};

const updates: UpdateItem[] = [
  {
    id: "partnership-2026-02-20",
    title: "AVLC Group Announces Strategic Partnership",
    summary: "A new partnership initiative focused on cross-border service delivery has been launched.",
    publishedAt: "2026-02-20",
  },
  {
    id: "platform-2026-01-15",
    title: "Platform Services Expansion",
    summary: "AVLC Group expanded its corporate platform services to support additional regional clients.",
    publishedAt: "2026-01-15",
  },
  {
    id: "governance-2025-12-02",
    title: "Governance Update Published",
    summary: "Updated governance details and leadership notes are now available for stakeholder review.",
    publishedAt: "2025-12-02",
  },
];

export function getPublishedUpdates(): UpdateItem[] {
  return [...updates].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getUpdatesVersion(items: UpdateItem[]): string {
  if (items.length === 0) {
    return "empty";
  }

  const fingerprint = items
    .map((item) => `${item.id}:${item.publishedAt}:${item.title}:${item.summary}`)
    .join("|");
  return `${items.length}:${fingerprint}`;
}

export function getUpdatesPayload(): { updates: UpdateItem[]; version: string } {
  const sorted = getPublishedUpdates();
  return {
    updates: sorted,
    version: getUpdatesVersion(sorted),
  };
}
