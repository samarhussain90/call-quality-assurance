import { useState, useEffect } from "react";
import { apiFetchCampaigns, apiFetchCalls } from "@/api/index";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

// Dynamic state for campaigns & calls
interface CallItem { 
  id: string; 
  date: string; 
  agent: string; 
  duration: string; 
  score: number; 
  status: string; 
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
  const [calls, setCalls] = useState<CallItem[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [errorCampaigns, setErrorCampaigns] = useState<string | null>(null);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [errorCalls, setErrorCalls] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch campaigns on mount
  useEffect(() => {
    setLoadingCampaigns(true);
    apiFetchCampaigns()
      .then(data => {
        setCampaigns(data);
        if (data.length > 0) setSelectedCampaign(data[0].id);
      })
      .catch(err => setErrorCampaigns(err.message))
      .finally(() => setLoadingCampaigns(false));
  }, []);

  // Fetch calls when selectedCampaign, search, or page changes
  useEffect(() => {
    if (!selectedCampaign) return;
    setLoadingCalls(true);
    apiFetchCalls({
      campaignId: selectedCampaign,
      page: currentPage,
      pageSize: 10,
      search: searchQuery,
    })
      .then(data => {
        setCalls(data.calls);
        setTotalPages(Math.ceil(data.total / 10));
      })
      .catch(err => setErrorCalls(err.message))
      .finally(() => setLoadingCalls(false));
  }, [selectedCampaign, currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Campaigns</h2>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        <nav className="space-y-1">
          {loadingCampaigns ? (
            <div className="text-gray-400">Loading campaigns...</div>
          ) : errorCampaigns ? (
            <div className="text-red-500">{errorCampaigns}</div>
          ) : (
            campaigns.map(campaign => (
              <button
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCampaign === campaign.id
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {campaign.name}
              </button>
            ))
          )}
        </nav>
      </div>

      <div className="md:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {selectedCampaign ? `Calls for ${campaigns.find(c => c.id === selectedCampaign)?.name}` : 'Select a campaign'}
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        {loadingCalls ? (
          <div className="text-gray-400">Loading calls...</div>
        ) : errorCalls ? (
          <div className="text-red-500">{errorCalls}</div>
        ) : (
          <>
            <div className="rounded-md border border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Agent</TableHead>
                    <TableHead className="text-gray-400">Duration</TableHead>
                    <TableHead className="text-gray-400">Score</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => (
                    <TableRow key={call.id} className="border-gray-800">
                      <TableCell className="text-white">{call.date}</TableCell>
                      <TableCell className="text-white">{call.agent}</TableCell>
                      <TableCell className="text-white">{call.duration}</TableCell>
                      <TableCell className="text-white">{call.score}%</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(call.status)}>
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/campaigns/${selectedCampaign}/calls/${call.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}
