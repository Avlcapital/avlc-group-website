export const UPDATE_TYPES = ["Announcement", "Partnership", "Tender", "Product Launch", "Compliance"] as const;
export type UpdateType = (typeof UPDATE_TYPES)[number];

export const UPDATE_STATUSES = ["New", "Featured", "Published"] as const;
export type UpdateStatus = (typeof UPDATE_STATUSES)[number];

export type UpdateItem = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string; // ISO date string
  type: UpdateType;
  source: string;
  status: UpdateStatus;
  isPublished: boolean;
  location?: string;
  documentUrl?: string;
  externalUrl?: string;
};

export type UpdateInput = Omit<UpdateItem, "id"> & { id?: string };
