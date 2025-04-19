import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCampaign } from '@/contexts/CampaignContext';
import { v4 as uuidv4 } from 'uuid';
import { Campaign, mockCampaigns } from '@/mocks/campaigns';

export function NewCampaignPage() {
  const navigate = useNavigate();
  const { setSelectedCampaign } = useCampaign();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCampaign: Campaign = {
        id: uuidv4(),
        name,
        status: 'active',
        startDate: new Date().toISOString(),
        totalCalls: 0,
        successRate: 0,
        agentCount: 0
      };

      // In a real app, this would be an API call
      // For now, we'll just update the local state and mock data
      mockCampaigns.push(newCampaign);
      setSelectedCampaign(newCampaign);
      
      // Navigate to the new campaign's call log
      navigate(`/call-log/${newCampaign.id}`);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>
            Create a new campaign to start tracking calls and analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter campaign name"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 