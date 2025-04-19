import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCampaign } from '@/contexts/CampaignContext';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Phone,
  FileText,
  Settings,
  Users,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { campaigns, selectedCampaign, setSelectedCampaign } = useCampaign();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleCampaignClick = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      navigate(`/campaigns/${campaignId}/calls`);
    }
  };

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Phone className="h-6 w-6" />
          <span>Neural Call</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            to="/analytics"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
              isActive('/analytics') && 'bg-accent text-foreground'
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <div className="mt-4">
            <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
              Campaigns
            </div>
            <div className="mt-2 space-y-1">
              {campaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => handleCampaignClick(campaign.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                    selectedCampaign?.id === campaign.id && 'bg-accent text-foreground'
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                  {campaign.name}
                </button>
              ))}
            </div>
          </div>
          <Link
            to="/reports"
            className={cn(
              'mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
              isActive('/reports') && 'bg-accent text-foreground'
            )}
          >
            <FileText className="h-4 w-4" />
            Reports
          </Link>
          <Link
            to="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
              isActive('/settings') && 'bg-accent text-foreground'
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
} 