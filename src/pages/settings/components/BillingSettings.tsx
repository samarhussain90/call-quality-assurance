import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Table, Badge } from '@/components/ui';
import { Switch } from '@/components/ui/switch';
import { 
  fetchPlans, 
  createSubscription, 
  cancelSubscription, 
  fetchPaymentMethods,
  addPaymentMethod,
  updateBillingSettings,
  fetchInvoices
} from '@/api/billing';
import { Plan, Subscription, PaymentMethod, Invoice, BillingSettings as BillingSettingsType } from '@/types/billing';
import { CreditCard, Plus, Trash2, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function BillingSettings() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingSettings, setBillingSettings] = useState<BillingSettingsType>({
    customerId: '',
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would get the organization ID from your auth context
      const organizationId = 'org_123';
      const customerId = 'cus_123';

      // Fetch plans
      const availablePlans = await fetchPlans();
      setPlans(availablePlans);

      // Fetch current subscription
      // In a real app, you would fetch this from your backend
      const mockSubscription: Subscription = {
        id: 'sub_123',
        customerId,
        planId: 'plan_pro',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: 'sub_123',
        stripeCustomerId: customerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSubscription(mockSubscription);
      setCurrentPlan(availablePlans.find(p => p.id === mockSubscription.planId) || null);

      // Fetch payment methods
      const methods = await fetchPaymentMethods(customerId);
      setPaymentMethods(methods);

      // Fetch invoices
      const invoiceList = await fetchInvoices(customerId);
      setInvoices(invoiceList);

      // Fetch billing settings
      // In a real app, you would fetch this from your backend
      const mockSettings: BillingSettingsType = {
        customerId,
        billingEmail: 'billing@example.com',
        billingName: 'Example Corp',
        billingAddress: {
          line1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'US',
        },
        autoRenew: true,
        invoiceSettings: {},
      };
      setBillingSettings(mockSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would get the organization ID from your auth context
      const organizationId = 'org_123';
      const customerId = 'cus_123';

      // Create a new subscription
      const newSubscription = await createSubscription(
        organizationId,
        planId,
        paymentMethods[0]?.stripePaymentMethodId || ''
      );
      setSubscription(newSubscription);
      setCurrentPlan(plans.find(p => p.id === planId) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      setLoading(true);
      setError(null);

      const updatedSubscription = await cancelSubscription(subscription.id);
      setSubscription(updatedSubscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would:
      // 1. Open Stripe Elements to collect card details
      // 2. Create a payment method in Stripe
      // 3. Add it to the customer

      // For now, we'll simulate adding a payment method
      const customerId = 'cus_123';
      const paymentMethodId = 'pm_' + Math.random().toString(36).substr(2, 9);
      const newPaymentMethod = await addPaymentMethod(customerId, paymentMethodId);
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBillingSettings = async (settings: Partial<BillingSettingsType>) => {
    try {
      setLoading(true);
      setError(null);

      const customerId = 'cus_123';
      const updatedSettings = await updateBillingSettings(customerId, settings);
      setBillingSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Current Plan</h2>
          {currentPlan && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                  <p className="text-gray-500">{currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${currentPlan.price}</div>
                  <div className="text-gray-500">per {currentPlan.billingPeriod}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {currentPlan.features.map(feature => (
                  <div key={feature.id} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span>{feature.name}</span>
                    {feature.limit && (
                      <span className="ml-2 text-gray-500">(up to {feature.limit})</span>
                    )}
                  </div>
                ))}
              </div>
              {subscription?.cancelAtPeriodEnd ? (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-yellow-800">
                    Your subscription will be canceled at the end of the current billing period.
                  </p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  className="w-full"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <Card
                key={plan.id}
                className={`p-6 ${
                  currentPlan?.id === plan.id ? 'border-blue-500' : ''
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-gray-500">{plan.description}</p>
                  </div>
                  <div className="text-2xl font-bold">${plan.price}</div>
                  <div className="space-y-2">
                    {plan.features.map(feature => (
                      <div key={feature.id} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <span>{feature.name}</span>
                        {feature.limit && (
                          <span className="ml-2 text-gray-500">
                            (up to {feature.limit})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant={currentPlan?.id === plan.id ? 'outline' : 'default'}
                    onClick={() => handlePlanChange(plan.id)}
                    className="w-full"
                    disabled={currentPlan?.id === plan.id}
                  >
                    {currentPlan?.id === plan.id ? 'Current Plan' : 'Switch Plan'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Payment Methods</h2>
            <Button onClick={handleAddPaymentMethod}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Card</th>
                <th>Expiry</th>
                <th>Default</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map(method => (
                <tr key={method.id}>
                  <td>
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>•••• {method.last4}</span>
                    </div>
                  </td>
                  <td>{method.expiryMonth}/{method.expiryYear}</td>
                  <td>
                    {method.isDefault ? (
                      <Badge variant="default">Default</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleUpdateBillingSettings({
                            defaultPaymentMethodId: method.id,
                          })
                        }
                      >
                        Make Default
                      </Button>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // In a real app, you would delete the payment method
                        setPaymentMethods(
                          paymentMethods.filter(pm => pm.id !== method.id)
                        );
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Billing Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Billing Email
              </label>
              <Input
                type="email"
                value={billingSettings.billingEmail}
                onChange={e =>
                  handleUpdateBillingSettings({
                    billingEmail: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Billing Name
              </label>
              <Input
                value={billingSettings.billingName}
                onChange={e =>
                  handleUpdateBillingSettings({
                    billingName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Billing Address
              </label>
              <Input
                value={billingSettings.billingAddress.line1}
                onChange={e =>
                  handleUpdateBillingSettings({
                    billingAddress: {
                      ...billingSettings.billingAddress,
                      line1: e.target.value,
                    },
                  })
                }
                placeholder="Street address"
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={billingSettings.billingAddress.city}
                  onChange={e =>
                    handleUpdateBillingSettings({
                      billingAddress: {
                        ...billingSettings.billingAddress,
                        city: e.target.value,
                      },
                    })
                  }
                  placeholder="City"
                />
                <Input
                  value={billingSettings.billingAddress.state}
                  onChange={e =>
                    handleUpdateBillingSettings({
                      billingAddress: {
                        ...billingSettings.billingAddress,
                        state: e.target.value,
                      },
                    })
                  }
                  placeholder="State"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  value={billingSettings.billingAddress.postalCode}
                  onChange={e =>
                    handleUpdateBillingSettings({
                      billingAddress: {
                        ...billingSettings.billingAddress,
                        postalCode: e.target.value,
                      },
                    })
                  }
                  placeholder="Postal code"
                />
                <Input
                  value={billingSettings.billingAddress.country}
                  onChange={e =>
                    handleUpdateBillingSettings({
                      billingAddress: {
                        ...billingSettings.billingAddress,
                        country: e.target.value,
                      },
                    })
                  }
                  placeholder="Country"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Auto-renew</label>
                <p className="text-sm text-gray-500">
                  Automatically renew your subscription
                </p>
              </div>
              <Switch
                checked={billingSettings.autoRenew}
                onCheckedChange={checked =>
                  handleUpdateBillingSettings({ autoRenew: checked })
                }
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Billing History</h2>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </td>
                  <td>${invoice.amount}</td>
                  <td>
                    <Badge
                      variant={
                        invoice.status === 'paid'
                          ? 'default'
                          : invoice.status === 'open'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // In a real app, you would download the invoice PDF
                        toast({
                          title: "Downloading invoice",
                          description: `Invoice #${invoice.id} is being prepared for download.`,
                        });
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
} 