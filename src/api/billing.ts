import Stripe from 'stripe';
import { 
  Plan, 
  Subscription, 
  UsageRecord, 
  Invoice, 
  PaymentMethod, 
  BillingSettings 
} from '@/types/billing';
import { Organization } from '@/types/tenant';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Mock data for development
const mockPlans: Plan[] = [
  {
    id: 'plan_basic',
    name: 'Basic',
    description: 'For small teams getting started',
    price: 29,
    billingPeriod: 'monthly',
    features: [
      { id: 'users', name: 'Users', description: 'Up to 5 users', included: true, limit: 5 },
      { id: 'api_calls', name: 'API Calls', description: '1,000 calls per month', included: true, limit: 1000 },
      { id: 'storage', name: 'Storage', description: '5GB storage', included: true, limit: 5000 },
      { id: 'concurrent_calls', name: 'Concurrent Calls', description: 'Up to 3 concurrent calls', included: true, limit: 3 },
    ],
    stripePriceId: 'price_basic_monthly',
    maxUsers: 5,
    maxApiCalls: 1000,
    maxStorage: 5000,
    maxConcurrentCalls: 3,
  },
  {
    id: 'plan_pro',
    name: 'Professional',
    description: 'For growing businesses',
    price: 99,
    billingPeriod: 'monthly',
    features: [
      { id: 'users', name: 'Users', description: 'Up to 20 users', included: true, limit: 20 },
      { id: 'api_calls', name: 'API Calls', description: '10,000 calls per month', included: true, limit: 10000 },
      { id: 'storage', name: 'Storage', description: '50GB storage', included: true, limit: 50000 },
      { id: 'concurrent_calls', name: 'Concurrent Calls', description: 'Up to 10 concurrent calls', included: true, limit: 10 },
    ],
    stripePriceId: 'price_pro_monthly',
    isPopular: true,
    maxUsers: 20,
    maxApiCalls: 10000,
    maxStorage: 50000,
    maxConcurrentCalls: 10,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 299,
    billingPeriod: 'monthly',
    features: [
      { id: 'users', name: 'Users', description: 'Unlimited users', included: true },
      { id: 'api_calls', name: 'API Calls', description: 'Unlimited API calls', included: true },
      { id: 'storage', name: 'Storage', description: '500GB storage', included: true, limit: 500000 },
      { id: 'concurrent_calls', name: 'Concurrent Calls', description: 'Unlimited concurrent calls', included: true },
    ],
    stripePriceId: 'price_enterprise_monthly',
    maxStorage: 500000,
  },
];

// Mock subscriptions
const mockSubscriptions: Subscription[] = [];

// Mock usage records
const mockUsageRecords: UsageRecord[] = [];

// Mock invoices
const mockInvoices: Invoice[] = [];

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [];

// Mock billing settings
const mockBillingSettings: Record<string, BillingSettings> = {};

// Fetch available plans
export async function fetchPlans(): Promise<Plan[]> {
  // In production, you would fetch this from your database
  // For now, return mock data
  return mockPlans;
}

// Create a subscription for an organization
export async function createSubscription(
  organizationId: string,
  planId: string,
  paymentMethodId: string
): Promise<Subscription> {
  try {
    // Find the plan
    const plan = mockPlans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // In production, you would:
    // 1. Create or retrieve the Stripe customer
    // 2. Attach the payment method to the customer
    // 3. Create a subscription in Stripe
    // 4. Store the subscription in your database
    
    // For now, create a mock subscription
    const subscription: Subscription = {
      id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      customerId: `cus_${Math.random().toString(36).substr(2, 9)}`,
      planId,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      stripeSubscriptionId: `sub_${Math.random().toString(36).substr(2, 9)}`,
      stripeCustomerId: `cus_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockSubscriptions.push(subscription);
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  try {
    // In production, you would:
    // 1. Cancel the subscription in Stripe
    // 2. Update the subscription in your database
    
    // For now, update the mock subscription
    const subscription = mockSubscriptions.find(s => s.id === subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    
    subscription.status = 'canceled';
    subscription.cancelAtPeriodEnd = true;
    subscription.canceledAt = new Date().toISOString();
    subscription.updatedAt = new Date().toISOString();
    
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Record usage for metered billing
export async function recordUsage(
  customerId: string,
  type: 'api_calls' | 'storage' | 'minutes' | 'users',
  quantity: number
): Promise<UsageRecord> {
  try {
    // In production, you would:
    // 1. Record the usage in your database
    // 2. Report the usage to Stripe for metered billing
    
    // For now, create a mock usage record
    const usageRecord: UsageRecord = {
      id: `usage_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      type,
      quantity,
      timestamp: new Date().toISOString(),
    };
    
    mockUsageRecords.push(usageRecord);
    return usageRecord;
  } catch (error) {
    console.error('Error recording usage:', error);
    throw error;
  }
}

// Fetch invoices for a customer
export async function fetchInvoices(customerId: string): Promise<Invoice[]> {
  try {
    // In production, you would:
    // 1. Fetch invoices from Stripe
    // 2. Store them in your database for quick access
    
    // For now, return mock invoices
    return mockInvoices.filter(i => i.customerId === customerId);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

// Fetch payment methods for a customer
export async function fetchPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
  try {
    // In production, you would:
    // 1. Fetch payment methods from Stripe
    
    // For now, return mock payment methods
    return mockPaymentMethods.filter(p => p.customerId === customerId);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
}

// Add a payment method to a customer
export async function addPaymentMethod(
  customerId: string,
  paymentMethodId: string,
  isDefault: boolean = false
): Promise<PaymentMethod> {
  try {
    // In production, you would:
    // 1. Attach the payment method to the customer in Stripe
    // 2. Set it as default if requested
    
    // For now, create a mock payment method
    const paymentMethod: PaymentMethod = {
      id: `pm_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      type: 'card',
      isDefault,
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      brand: 'visa',
      stripePaymentMethodId: paymentMethodId,
    };
    
    mockPaymentMethods.push(paymentMethod);
    return paymentMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
}

// Update billing settings
export async function updateBillingSettings(
  customerId: string,
  settings: Partial<BillingSettings>
): Promise<BillingSettings> {
  try {
    // In production, you would:
    // 1. Update the customer in Stripe
    // 2. Update the settings in your database
    
    // For now, update the mock settings
    const currentSettings = mockBillingSettings[customerId] || {
      customerId,
      billingEmail: '',
      billingName: '',
      billingAddress: {
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      autoRenew: true,
      invoiceSettings: {},
    };
    
    const updatedSettings = {
      ...currentSettings,
      ...settings,
    };
    
    mockBillingSettings[customerId] = updatedSettings;
    return updatedSettings;
  } catch (error) {
    console.error('Error updating billing settings:', error);
    throw error;
  }
}

// Handle Stripe webhooks
export async function handleStripeWebhook(
  signature: string,
  payload: Buffer
): Promise<void> {
  try {
    // In production, you would:
    // 1. Verify the webhook signature
    // 2. Parse the event
    // 3. Handle different event types (invoice.paid, customer.subscription.updated, etc.)
    
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
    
    // Handle webhook events
    const handleWebhookEvent = async (event: Stripe.Event) => {
      try {
        switch (event.type) {
          case 'invoice.payment_succeeded':
            await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
            break;
          case 'invoice.payment_failed':
            await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
            break;
          case 'customer.subscription.updated':
            await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
            break;
          case 'customer.subscription.deleted':
            await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
            break;
          default:
            // Log unhandled event types for debugging
            // Unhandled event types will be logged in production
            break;
        }
      } catch (error) {
        throw new Error(`Error handling webhook event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    await handleWebhookEvent(event);
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
} 