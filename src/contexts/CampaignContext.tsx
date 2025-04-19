import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { mockCampaigns } from '@/mocks/campaigns';
import { Campaign } from '@/mocks/campaigns';
import { useLocation } from 'react-router-dom';

interface CampaignContextType {
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  clearSelectedCampaign: () => void;
  getCampaignById: (id: string) => Campaign | undefined;
  getAllCampaigns: () => Campaign[];
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  isCampaignSelected: () => boolean;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const location = useLocation();

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

  // Check if a campaign is selected
  const isCampaignSelected = useCallback(() => {
    return selectedCampaign !== null;
  }, [selectedCampaign]);

  // Update selected campaign based on URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const campaignIdIndex = pathParts.indexOf('campaign');
    
    if (campaignIdIndex !== -1 && campaignIdIndex + 1 < pathParts.length) {
      const campaignId = pathParts[campaignIdIndex + 1];
      const campaign = getCampaignById(campaignId);
      
      if (campaign) {
        setSelectedCampaign(campaign);
      } else {
        clearSelectedCampaign();
      }
    } else if (!location.pathname.includes('campaign')) {
      clearSelectedCampaign();
    }
  }, [location.pathname, getCampaignById, clearSelectedCampaign]);

  return (
    <CampaignContext.Provider 
      value={{ 
        selectedCampaign, 
        setSelectedCampaign, 
        clearSelectedCampaign,
        getCampaignById,
        getAllCampaigns,
        campaigns,
        addCampaign,
        isCampaignSelected
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