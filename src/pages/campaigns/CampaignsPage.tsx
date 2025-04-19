import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "scheduled" | "completed" | "draft";
  startDate: string;
  endDate: string;
  totalCalls: number;
  successRate: number;
  agentCount: number;
}

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Q1 Sales Outreach",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    totalCalls: 1500,
    successRate: 85,
    agentCount: 10
  },
  {
    id: "camp-2",
    name: "Customer Feedback Survey",
    status: "scheduled",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    totalCalls: 0,
    successRate: 0,
    agentCount: 0
  },
  {
    id: "camp-3",
    name: "Product Launch Follow-up",
    status: "completed",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    totalCalls: 800,
    successRate: 92,
    agentCount: 8
  }
];

export default function CampaignsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  
  // Get current tab from URL or default to "all"
  const currentTab = location.pathname.split("/").pop() || "all";
  
  const handleTabChange = (value: string) => {
    navigate(`/campaign-calls/${value}`);
  };

  const getStatusBadgeVariant = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "scheduled":
        return "warning";
      case "completed":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "default";
    }
  };

  // Filter campaigns based on search query and current tab
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = currentTab === "all" || campaign.status === currentTab;
    return matchesSearch && matchesTab;
  });

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaigns/${campaignId}/calls`);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    // TODO: Implement edit functionality
    console.log('Edit campaign:', campaign);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete campaign:', campaignId);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Campaigns</h1>
          <p className="text-sm text-gray-500">Manage and monitor your call campaigns</p>
        </div>
        <Button onClick={() => setShowNewCampaignModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search campaigns..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Agent Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium"
                        onClick={() => handleCampaignClick(campaign.id)}
                      >
                        {campaign.name}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.totalCalls}</TableCell>
                    <TableCell>{campaign.successRate}%</TableCell>
                    <TableCell>{campaign.agentCount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCampaignClick(campaign.id)}>
                            View Calls
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCampaign(campaign.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
