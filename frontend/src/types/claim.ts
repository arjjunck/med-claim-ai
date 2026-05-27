export type RiskLevel = "Low" | "Medium" | "High";

export type ClaimResult = {
  claimNumber: string;
  patientReference: string;
  procedureCode: string;
  amount: number;
  providerName: string;
  riskLevel: RiskLevel;
  riskReason: string;
};