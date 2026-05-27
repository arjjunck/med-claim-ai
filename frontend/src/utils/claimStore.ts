import type { ClaimResult } from "../types/claim";

const STORAGE_KEY = "mediclaim_claim_results";

export function getDemoClaims(): ClaimResult[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ClaimResult[];
  } catch {
    return [];
  }
}

export function saveDemoClaims(claims: ClaimResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

export function clearDemoClaims() {
  localStorage.removeItem(STORAGE_KEY);
}