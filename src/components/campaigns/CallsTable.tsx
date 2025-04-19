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
import { Eye } from "lucide-react";

interface CallItem {
  id: string;
  date: string;
  agent: string;
  duration: string;
  score: number;
  status: string;
}

interface CallsTableProps {
  calls: CallItem[];
}

export function CallsTable({ calls }: CallsTableProps) {
  const navigate = useNavigate();

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

  const handleViewCall = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>{call.date}</TableCell>
              <TableCell>{call.agent}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell className="text-right">{call.score}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(call.status)}>
                  {call.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleViewCall(call.id)}
                  title="View Call Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 