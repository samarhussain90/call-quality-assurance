import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockCampaigns } from '@/mocks/campaigns';
import { Campaign } from '@/mocks/campaigns';

interface CampaignContextType {
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  clearSelectedCampaign: () => void;
  getCampaignById: (id: string) => Campaign | undefined;
  getAllCampaigns: () => Campaign[];
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

  // Clear the selected campaign
  const clearSelectedCampaign = useCallback(() => {
    setSelectedCampaign(null);
  }, []);

  // Get a campaign by ID
  const getCampaignById = useCallback((id: string) => {
    return campaigns.find(campaign => campaign.id === id);
  }, [campaigns]);

  // Get all campaigns
  const getAllCampaigns = useCallback(() => {
    return campaigns;
  }, [campaigns]);

  // Add a new campaign
  const addCampaign = useCallback((campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign]);
  }, []);

  return (
    <CampaignContext.Provider 
      value={{ 
        selectedCampaign, 
        setSelectedCampaign, 
        clearSelectedCampaign,
        getCampaignById,
        getAllCampaigns,
        campaigns,
        addCampaign
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
} 