// This is the central source of truth for all shared types.

export interface ChangeOrder {
  // Core Fields (mostly non-nullable)
  pcoNum?: string; // Can be a number or string like "-012"
  status?: string | null;
  description?: string;
  quoteDate?: Date | null;
  totalQuote?: string; // Formatted currency

  // Optional & Mixed Fields from both samples
  revision?: string | number;
  bmbPcoNum?: number | string;
  quoteType?: string | null;
  ownerCONum?: string | null;
  ownerCODate?: Date | null;
  ownerCOValue?: string | null;
  notes?: string | null;
  cwPropNum?: number;
  gcPropNum?: number | null;
  dateSent?: Date;
  amountSent?: string;
  daysPending?: number | null;
  dateApproved?: Date | null;
  amountApproved?: string | null;
  amountPending?: string;
  gcCO?: string | null;
  approvedDate?: Date | null;
  coIssuedDate?: Date | null;
  voidDate?: Date | null;
}

export type ShapedData = {
  documentTitle: string;
  subcontractor: string;
  generalContractor: string;
  project: string;
  headers: Record<string, string>;
  data: ChangeOrder[];
  includedColumns: (keyof ChangeOrder)[];
  // Optional fields for complex headers
  projectNumber?: string;
  contractSummary?: {
    baseContract: string;
    changesQuoted: string;
    changesApproved: string;
    revisedContract: string;
  };
  pageHeader?: string | undefined;
};

export type PreformattedCorData = {
  approved_co_date: string | null;
  approved_proceed_date: string | null;
  cor_number: string;
  cor_title: string;
  cor_value: number;
  customer_co_number: string | null;
  customer_reference_number: string | null;
  date_submitted: string | null;
  labels: string | null;
  status: number;
  status_printed: string;
  tm_tag_number: string | null;
  void_date: string | null;
};

export interface Allowance {
  allowanceName: string;
  customerReferenceNumber?: string | undefined;
  allowanceType: "hold" | "contingency" | "allowance";
  allowanceValue: number;
  contract?: string | undefined;
}
