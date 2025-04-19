import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft } from "lucide-react";

interface Call {
  id: string;
  date: string;
  agent: string;
  duration: string;
  score: number;
  status: "completed" | "in-progress" | "failed";
}

// Mock data
const mockCalls: Call[] = [
  { id: "101", date: "2024-03-15", agent: "John Smith", duration: "15:32", score: 85, status: "completed" },
  { id: "102", date: "2024-03-14", agent: "Sarah Johnson", duration: "12:45", score: 92, status: "completed" },
  { id: "103", date: "2024-03-13", agent: "Michael Brown", duration: "18:20", score: 78, status: "completed" },
  { id: "104", date: "2024-03-12", agent: "Emily Davis", duration: "10:15", score: 85, status: "in-progress" },
  { id: "105", date: "2024-03-11", agent: "David Wilson", duration: "22:05", score: 65, status: "failed" }
];

export function CampaignDetailPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calls based on search query
  const filteredCalls = mockCalls.filter(call =>
    call.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.date.includes(searchQuery)
  );

  const getStatusBadgeVariant = (status: Call["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold mb-1">Campaign Details</h1>
          <p className="text-sm text-gray-500">View and manage campaign calls</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search calls..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-lg cursor-pointer transition-colors"
              onClick={() => navigate(`/campaign-calls/${campaignId}/calls/${call.id}`)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium">{call.agent}</h3>
                  <Badge variant={getStatusBadgeVariant(call.status)}>
                    {call.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">{call.date}</div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="font-medium">{call.duration}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{call.score}%</div>
                  <div className="text-sm text-gray-500">Quality Score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 