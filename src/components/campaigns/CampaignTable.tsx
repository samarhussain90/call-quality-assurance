import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Play, Pause, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";

interface Campaign {
  id: number;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  totalCalls: number;
  successRate: number;
  agentCount: number;
}

interface CampaignTableProps {
  campaigns: Campaign[];
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

export function CampaignTable({ campaigns, onDelete, onStatusChange }: CampaignTableProps) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Campaign;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  const handleSort = (key: keyof Campaign) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (a[sortConfig.key] === null) return 1;
    if (b[sortConfig.key] === null) return -1;

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'scheduled':
        return 'outline';
      case 'draft':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'MMM d, yyyy');
  };

  const handleViewCalls = (campaignId: string) => {
    navigate(`/campaigns/${campaignId}/calls`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Campaign Name
              {sortConfig.key === 'name' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Status
              {sortConfig.key === 'status' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('startDate')}
            >
              Start Date
              {sortConfig.key === 'startDate' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('endDate')}
            >
              End Date
              {sortConfig.key === 'endDate' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort('totalCalls')}
            >
              Total Calls
              {sortConfig.key === 'totalCalls' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort('successRate')}
            >
              Success Rate
              {sortConfig.key === 'successRate' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCampaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => handleViewCalls(campaign.id.toString())}
                >
                  {campaign.name}
                </Button>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(campaign.status)}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(campaign.startDate)}</TableCell>
              <TableCell>{formatDate(campaign.endDate)}</TableCell>
              <TableCell className="text-right">{campaign.totalCalls.toLocaleString()}</TableCell>
              <TableCell className="text-right">{campaign.successRate}%</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewCalls(campaign.id.toString())}>
                      View Calls
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(campaign.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 