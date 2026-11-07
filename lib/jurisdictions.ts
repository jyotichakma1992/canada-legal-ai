export const JURISDICTIONS = [
  { id: "QC", label: "Quebec" },
  { id: "ON", label: "Ontario" },
  { id: "BC", label: "British Columbia" },
  { id: "AB", label: "Alberta" },
  { id: "MB", label: "Manitoba" },
  { id: "SK", label: "Saskatchewan" },
  { id: "NS", label: "Nova Scotia" },
  { id: "NB", label: "New Brunswick" },
  { id: "NL", label: "Newfoundland and Labrador" },
  { id: "PE", label: "Prince Edward Island" },
  { id: "YT", label: "Yukon" },
  { id: "NT", label: "Northwest Territories" },
  { id: "NU", label: "Nunavut" },
  { id: "CA", label: "Federal / Canada-wide" },
] as const;

export type JurisdictionId = (typeof JURISDICTIONS)[number]["id"];

export const DEFAULT_JURISDICTION: JurisdictionId = "CA";

const BY_ID = new Map(JURISDICTIONS.map((item) => [item.id, item]));

export function isJurisdictionId(value: string): value is JurisdictionId {
  return BY_ID.has(value as JurisdictionId);
}

export function jurisdictionById(id: JurisdictionId) {
  const match = BY_ID.get(id);
  if (!match) {
    return JURISDICTIONS[JURISDICTIONS.length - 1];
  }
  return match;
}
