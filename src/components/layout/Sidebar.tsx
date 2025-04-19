import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockCampaigns } from "@/mocks/campaigns";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCampaign, setSelectedCampaign } = useCampaign();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedCampaigns, setExpandedCampaigns] = useState<Record<string, boolean>>({});

  const handleCampaignSelect = (campaignId: string) => {
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      navigate(`/campaign/${campaignId}/calls`);
      setExpandedCampaigns(prev => ({
        ...prev,
        [campaignId]: !prev[campaignId]
      }));
    }
    setIsSearchOpen(false);
  };

  const handleSubItemClick = (campaignId: string, path: string) => {
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      navigate(`/campaign/${campaignId}/${path}`);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const isSubItemActive = (campaignId: string, path: string) => {
    return location.pathname === `/campaign/${campaignId}/${path}`;
  };

  return (
    <div className="flex h-full flex-col border-r bg-background w-64">
      <div className="flex h-14 items-center border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <span className="font-semibold">Campaigns</span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search Campaigns
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/campaigns/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>
          </div>
          {isExpanded && (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Active Campaigns
              </h2>
              <div className="space-y-1">
                {mockCampaigns
                  .filter(campaign => campaign.status === "active")
                  .map(campaign => (
                    <Collapsible
                      key={campaign.id}
                      open={expandedCampaigns[campaign.id]}
                      onOpenChange={(open) => 
                        setExpandedCampaigns(prev => ({
                          ...prev,
                          [campaign.id]: open
                        }))
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant={selectedCampaign?.id === campaign.id ? "secondary" : "ghost"}
                          className="w-full justify-start"
                        >
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${getStatusVariant(
                                campaign.status
                              )}`}
                            />
                            <span className="truncate">{campaign.name}</span>
                            <ChevronRight
                              className={cn(
                                "ml-auto h-4 w-4 transition-transform",
                                expandedCampaigns[campaign.id] && "rotate-90"
                              )}
                            />
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4">
                        <div className="space-y-1 py-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isSubItemActive(campaign.id, "calls") && "bg-accent"
                            )}
                            onClick={() => handleSubItemClick(campaign.id, "calls")}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call Log
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isSubItemActive(campaign.id, "overview") && "bg-accent"
                            )}
                            onClick={() => handleSubItemClick(campaign.id, "overview")}
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Overview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isSubItemActive(campaign.id, "insights") && "bg-accent"
                            )}
                            onClick={() => handleSubItemClick(campaign.id, "insights")}
                          >
                            <Brain className="mr-2 h-4 w-4" />
                            AI Insights
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isSubItemActive(campaign.id, "quality") && "bg-accent"
                            )}
                            onClick={() => handleSubItemClick(campaign.id, "quality")}
                          >
                            <LineChart className="mr-2 h-4 w-4" />
                            Quality Trends
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isSubItemActive(campaign.id, "compliance") && "bg-accent"
                            )}
                            onClick={() => handleSubItemClick(campaign.id, "compliance")}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Compliance
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isSubItemActive(campaign.id, "performance") && "bg-accent"
                            )}
                            onClick={() => handleSubItemClick(campaign.id, "performance")}
                          >
                            <Zap className="mr-2 h-4 w-4" />
                            Performance
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
              </div>
            </div>
          )}
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/reports")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Search campaigns..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Campaigns">
            {mockCampaigns.map((campaign) => (
              <CommandItem
                key={campaign.id}
                onSelect={() => handleCampaignSelect(campaign.id)}
              >
                <div className="flex items-center">
                  <div
                    className={`mr-2 h-2 w-2 rounded-full ${getStatusVariant(
                      campaign.status
                    )}`}
                  />
                  <span>{campaign.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
} 