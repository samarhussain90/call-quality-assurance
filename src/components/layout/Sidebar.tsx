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
  Plus,
  LayoutDashboard,
  Brain,
  LineChart,
  Shield,
  Zap,
  HelpCircle,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { campaigns, selectedCampaign, setSelectedCampaign, clearSelectedCampaign } = useCampaign();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleCampaignClick = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      navigate(`/campaign/${campaignId}`);
    }
  };

  const handleDashboardClick = () => {
    clearSelectedCampaign();
    navigate('/dashboard');
  };

  const handleReportClick = (path: string) => {
    if (selectedCampaign) {
      navigate(path);
    }
  };

  // Extract campaign ID from URL for highlighting
  const getCampaignIdFromPath = () => {
    const pathParts = location.pathname.split('/');
    const campaignIndex = pathParts.indexOf('campaign');
    if (campaignIndex !== -1 && pathParts[campaignIndex + 1]) {
      return pathParts[campaignIndex + 1];
    }
    return selectedCampaign?.id;
  };

  const currentCampaignId = getCampaignIdFromPath();

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
            to="/dashboard"
            onClick={handleDashboardClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
              isActive('/dashboard') && 'bg-accent text-foreground'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          
          {/* Campaigns Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-3 text-xs font-semibold uppercase text-muted-foreground">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                Campaigns
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => navigate('/campaigns/new')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {campaigns.map((campaign) => (
                <div key={campaign.id}>
                  <button
                    onClick={() => handleCampaignClick(campaign.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                      currentCampaignId === campaign.id && 'bg-accent text-foreground'
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                    {campaign.name}
                  </button>
                  
                  {/* Campaign-specific features - show when campaign is selected or active */}
                  {(currentCampaignId === campaign.id || selectedCampaign?.id === campaign.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      <button
                        onClick={() => handleReportClick(`/campaign/${campaign.id}`)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                          isActive(`/campaign/${campaign.id}`) && 'bg-accent text-foreground'
                        )}
                      >
                        <BarChart3 className="h-4 w-4" />
                        Overview
                      </button>
                      <button
                        onClick={() => handleReportClick('/analytics/insights')}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                          isActive('/analytics/insights') && 'bg-accent text-foreground'
                        )}
                      >
                        <Brain className="h-4 w-4" />
                        AI Insights
                      </button>
                      <button
                        onClick={() => handleReportClick('/performance/quality')}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                          isActive('/performance/quality') && 'bg-accent text-foreground'
                        )}
                      >
                        <LineChart className="h-4 w-4" />
                        Quality Trends
                      </button>
                      <button
                        onClick={() => handleReportClick('/performance/compliance')}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                          isActive('/performance/compliance') && 'bg-accent text-foreground'
                        )}
                      >
                        <Shield className="h-4 w-4" />
                        Compliance
                      </button>
                      <button
                        onClick={() => handleReportClick('/performance/campaigns')}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-foreground',
                          isActive('/performance/campaigns') && 'bg-accent text-foreground'
                        )}
                      >
                        <Zap className="h-4 w-4" />
                        Performance
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Support Section */}
          <div className="mt-4">
            <div className="flex items-center px-3 text-xs font-semibold uppercase text-muted-foreground">
              <ChevronDown className="h-4 w-4 mr-2" />
              Support
            </div>
            <div className="mt-2 space-y-1">
              <Link
                to="/ai-assistant"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                  isActive('/ai-assistant') && 'bg-accent text-foreground'
                )}
              >
                <Bot className="h-4 w-4" />
                AI Assistant
              </Link>
              <Link
                to="/help"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                  isActive('/help') && 'bg-accent text-foreground'
                )}
              >
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Link>
            </div>
          </div>
          
          <Link
            to="/settings"
            className={cn(
              'mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
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