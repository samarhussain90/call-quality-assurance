import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "scheduled" | "completed" | "draft";
  type: "outbound" | "inbound";
  totalCalls: number;
  successRate: number;
  lastRun: string;
}

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Sales Follow-up Q1",
    status: "active",
    type: "outbound",
    totalCalls: 150,
    successRate: 75,
    lastRun: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Customer Feedback",
    status: "scheduled",
    type: "outbound",
    totalCalls: 0,
    successRate: 0,
    lastRun: "2024-03-20T14:00:00Z",
  },
  {
    id: "3",
    name: "Support Follow-up",
    status: "completed",
    type: "inbound",
    totalCalls: 300,
    successRate: 82,
    lastRun: "2024-03-10T09:00:00Z",
  },
];

export function CampaignListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      case "draft":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => navigate(`/campaign-calls/${campaign.id}`)}
              >
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {campaign.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {campaign.totalCalls} calls
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {campaign.successRate}% success
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 