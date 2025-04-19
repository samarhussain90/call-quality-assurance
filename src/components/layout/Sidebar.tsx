import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCampaign } from "@/contexts/CampaignContext";
import { 
  BarChart3, 
  FolderOpen, 
  Settings, 
  LineChart, 
  TrendingUp, 
  FileText, 
  Bot, 
  Database, 
  Shield, 
  Users, 
  Zap,
  ChevronDown,
  ChevronRight,
  Bell,
  HelpCircle,
  Menu,
  Brain,
  FileBarChart,
  LayoutDashboard,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns } from "@/mocks/campaigns";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { selectedCampaign, setSelectedCampaign, clearSelectedCampaign, getCampaignById } = useCampaign();
  
  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  // Handle navigation to non-campaign routes
  const handleNonCampaignNavigation = (path: string) => {
    clearSelectedCampaign(); // Use the new clearSelectedCampaign function
    navigate(path);
  };
  
  // Handle campaign selection
  const handleCampaignSelect = (campaignId: string) => {
    const campaign = getCampaignById(campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      // Navigate to the call log page for the selected campaign
      navigate(`/call-log/${campaignId}`);
      // Force a re-render of dependent components
      window.dispatchEvent(new CustomEvent('campaignSelected', { detail: campaign }));
    }
  };
  
  const navItems = [
    {
      id: "analytics",
      title: "Analytics",
      path: "/analytics/overview",
      icon: <LineChart size={20} />,
      children: [
        { title: "Overview", path: "/analytics/overview" },
        { title: "Call Analytics", path: "/analytics/calls" },
        { title: "Performance", path: "/analytics/performance" },
        { title: "Historical", path: "/analytics/historical" },
        { title: "Report Builder", path: "/analytics/builder" },
        { title: "Data Warehouse", path: "/analytics/warehouse" },
        { title: "AI Insights", path: "/analytics/insights" },
        { title: "Custom Reports", path: "/analytics/reports" }
      ]
    },
    {
      id: "performance",
      title: "Performance",
      path: "/performance",
      icon: <TrendingUp size={20} />,
      badge: 2,
      children: [
        { title: "Agent Performance", path: "/performance/agents" },
        { title: "Campaign Performance", path: "/performance/campaigns" },
        { title: "Compliance Monitoring", path: "/performance/compliance" },
        { title: "Quality Trends", path: "/performance/quality" }
      ]
    },
    {
      id: "reports",
      title: "Reports",
      path: "/reports",
      icon: <FileText size={20} />,
      children: [
        { title: "All Reports", path: "/reports" },
        { title: "Scheduled Reports", path: "/reports/scheduled" },
        { title: "Report Builder", path: "/reports/builder" }
      ]
    },
    {
      id: "settings",
      title: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
      children: [
        { title: "General", path: "/settings/general" },
        { title: "Compliance Rules", path: "/settings/compliance" },
        { title: "Agent Analytics", path: "/settings/agent-analytics" },
        { title: "Integrations", path: "/settings/integrations" },
        { title: "Model Training", path: "/settings/model-training" }
      ]
    }
  ];
  
  const serviceItems = [
    {
      id: "ai-assistant",
      title: "AI Assistant",
      path: "/ai-assistant",
      icon: <Bot size={20} />,
      badge: "New"
    },
    {
      id: "notifications",
      title: "Notifications",
      path: "/notifications",
      icon: <Bell size={20} />,
      badge: 5
    },
    {
      id: "help",
      title: "Help & Support",
      path: "/help",
      icon: <HelpCircle size={20} />
    }
  ];

  return (
    <aside 
      className={cn(
        "bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold text-white">Navigation</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </Button>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {/* Dashboard Link */}
        <div className="mb-4">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors",
              location.pathname === "/dashboard" && "bg-gray-700 text-white"
            )}
            onClick={() => handleNonCampaignNavigation("/dashboard")}
          >
            <LayoutDashboard size={20} className="mr-2" />
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </div>
        
        {/* Campaign Call Logs section - Moved to top, right after Dashboard */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between">
            {!collapsed && <h2 className="text-sm font-semibold text-white">Campaign Call Logs</h2>}
            {!collapsed && (
              <Link to="/campaigns/new">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
          {mockCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/call-log/${campaign.id}`}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors",
                location.pathname === `/call-log/${campaign.id}` && "bg-gray-700 text-white"
              )}
              onClick={() => handleCampaignSelect(campaign.id)}
            >
              {campaign.name}
            </Link>
          ))}
        </div>
        
        {/* Main Navigation Items */}
        {navItems.map((item) => (
          <div key={item.id} className="space-y-1">
            <div 
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer",
                location.pathname === item.path && "bg-gray-700 text-white"
              )}
              onClick={(e) => {
                if (item.children) {
                  // If the item has a path and we're not clicking on the chevron, navigate
                  if (item.path && !(e.target as HTMLElement).closest('.chevron-icon')) {
                    handleNonCampaignNavigation(item.path);
                  } else {
                    // Otherwise just toggle expansion
                    toggleExpand(item.id);
                  }
                } else if (item.path) {
                  // If no children but has path, just navigate
                  handleNonCampaignNavigation(item.path);
                }
              }}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </div>
              <div className="flex items-center space-x-2">
                {item.badge && !collapsed && (
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    {item.badge}
                  </Badge>
                )}
                {item.children && !collapsed && (
                  <span className="chevron-icon">
                    {expandedItems.includes(item.id) 
                      ? <ChevronDown size={16} /> 
                      : <ChevronRight size={16} />}
                  </span>
                )}
              </div>
            </div>
            
            {item.children && expandedItems.includes(item.id) && !collapsed && (
              <div className="pl-6 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors",
                      location.pathname === child.path && "bg-gray-700 text-white"
                    )}
                    onClick={() => handleNonCampaignNavigation(child.path)}
                  >
                    <span>{child.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        {!collapsed && <h2 className="text-lg font-semibold text-white mb-2">Services</h2>}
        <div className="space-y-1">
          {serviceItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors",
                location.pathname === item.path && "bg-gray-700 text-white"
              )}
              onClick={() => handleNonCampaignNavigation(item.path)}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </div>
              {item.badge && !collapsed && (
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
} 