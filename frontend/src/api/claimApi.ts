const API_BASE_URL = "http://localhost:5283/api";

export type ClaimResponse = {
  id: string;
  claimNumber: string;
  patientReference: string;
  procedureCode: string;
  amount: number;
  claimDate: string;
  providerName: string;
  riskLevel: "Low" | "Medium" | "High";
  riskReason: string;
};

export type ClaimUploadResponse = {
  uploadedCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  claims: ClaimResponse[];
};

export async function uploadClaims(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/Claims/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Claim upload failed.");
  }

  return (await response.json()) as ClaimUploadResponse;
}

export async function getClaims(token: string) {
  const response = await fetch(`${API_BASE_URL}/Claims`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load claims.");
  }

  return (await response.json()) as ClaimResponse[];
}