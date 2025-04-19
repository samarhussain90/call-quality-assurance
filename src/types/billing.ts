export type SubscriptionStatus = 
  | "active" 
  | "canceled" 
  | "past_due" 
  | "trialing" 
  | "incomplete" 
  | "incomplete_expired" 
  | "unpaid";

export type BillingPeriod = "monthly" | "annual" | "quarterly";

export type PlanFeature = {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
};

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'month' | 'year';
  features: Array<{
    id: string;
    name: string;
    limit?: number;
  }>;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

export type UsageRecord = {
  id: string;
  customerId: string;
  type: "api_calls" | "storage" | "minutes" | "users";
  quantity: number;
  timestamp: string;
};

export interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  invoiceDate: string;
  dueDate: string;
  pdfUrl?: string;
}

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  description: string;
  amount: number;
  quantity: number;
  unitPrice: number;
};

export interface PaymentMethod {
  id: string;
  stripePaymentMethodId: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  type: 'card';
  brand: string;
}

export interface BillingSettings {
  customerId: string;
  billingEmail: string;
  billingName: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  autoRenew: boolean;
  invoiceSettings: Record<string, any>;
  defaultPaymentMethodId?: string;
} 