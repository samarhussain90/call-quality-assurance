import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Check, AlertCircle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  current?: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  expiry: string;
  brand: string;
  default: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    interval: 'month',
    features: [
      'Up to 5 agents',
      'Basic analytics',
      'Standard support',
      'Email notifications',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    interval: 'month',
    features: [
      'Up to 20 agents',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'API access',
    ],
    current: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'Unlimited agents',
      'Custom analytics',
      '24/7 support',
      'White-labeling',
      'SLA guarantee',
      'Dedicated account manager',
    ],
  },
];

const billingHistory: BillingHistory[] = [
  {
    id: 'inv_001',
    date: '2024-03-01',
    amount: 99,
    status: 'paid',
    description: 'Professional Plan - March 2024',
  },
  {
    id: 'inv_002',
    date: '2024-02-01',
    amount: 99,
    status: 'paid',
    description: 'Professional Plan - February 2024',
  },
  {
    id: 'inv_003',
    date: '2024-01-01',
    amount: 99,
    status: 'paid',
    description: 'Professional Plan - January 2024',
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm_001',
    type: 'card',
    last4: '4242',
    expiry: '12/25',
    brand: 'visa',
    default: true,
  },
];

export function PlanAndBilling() {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Plan & Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing settings
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-6 ${
                  plan.current ? 'border-primary' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    {plan.current && (
                      <Badge variant="secondary">Current Plan</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.current ? 'outline' : 'default'}
                    disabled={plan.current}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.current ? 'Current Plan' : 'Switch Plan'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <div className="divide-y">
              {billingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{invoice.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">${invoice.amount}</span>
                    <Badge
                      variant={
                        invoice.status === 'paid'
                          ? 'default'
                          : invoice.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <Button>Add Payment Method</Button>
              </div>
              <div className="divide-y">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <p className="font-medium">
                          {method.brand.charAt(0).toUpperCase() +
                            method.brand.slice(1)}{' '}
                          ending in {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiry}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 