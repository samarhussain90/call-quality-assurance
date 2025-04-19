import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockCampaigns } from '@/mocks/campaigns';
import { Campaign } from '@/mocks/campaigns';

interface CampaignContextType {
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  clearSelectedCampaign: () => void;
  getCampaignById: (id: string) => Campaign | undefined;
  getAllCampaigns: () => Campaign[];
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Clear the selected campaign
  const clearSelectedCampaign = useCallback(() => {
    setSelectedCampaign(null);
  }, []);

  // Get a campaign by ID
  const getCampaignById = useCallback((id: string) => {
    return mockCampaigns.find(campaign => campaign.id === id);
  }, []);

  // Get all campaigns
  const getAllCampaigns = useCallback(() => {
    return mockCampaigns;
  }, []);

  return (
    <CampaignContext.Provider 
      value={{ 
        selectedCampaign, 
        setSelectedCampaign, 
        clearSelectedCampaign,
        getCampaignById,
        getAllCampaigns
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