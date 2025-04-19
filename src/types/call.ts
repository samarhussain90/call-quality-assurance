export interface Call {
  id: string;
  timestamp: string;
  callType: string;
  debtAmount?: number;
  publisherName?: string;
  buyerName?: string;
  duration: number;
  customerName?: string;
  phoneNumber: string;
  notes?: string;
  dateOfBirth?: string;
  email?: string;
  employer?: string;
  jobTitle?: string;
  planLevel?: string;
  legalRep?: string;
  address?: string;
  cost?: number;
  agent: string;
  transcript?: string;
  recordingUrl?: string;
  status: string;
} 