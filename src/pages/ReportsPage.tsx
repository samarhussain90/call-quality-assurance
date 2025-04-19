import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Search, Filter, Calendar, Clock, FileText, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaign } from "@/contexts/CampaignContext";
import { useCallAnalytics } from "@/hooks/useCallAnalytics";

interface Report {
  id: string;
  name: string;
  createdBy: string;
  lastRun: string;
  schedule: string;
  status: 'active' | 'scheduled' | 'draft' | 'completed';
  isTemplate?: boolean;
}

export default function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: string }>();
  const activeTab = tab || "all";
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCampaign } = useCampaign();
  const { isFiltered, campaignName } = useCallAnalytics();

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockReports: Report[] = selectedCampaign ? [
        { 
          id: "1", 
          name: `${selectedCampaign.name} - Call Volume Analysis`, 
          createdBy: "John Smith", 
          lastRun: "2024-04-15", 
          schedule: "Daily",
          status: 'active'
        },
        { 
          id: "2", 
          name: `${selectedCampaign.name} - Performance Summary`, 
          createdBy: "Sarah Johnson", 
          lastRun: "2024-04-18", 
          schedule: "Weekly",
          status: 'active'
        },
        { 
          id: "3", 
          name: `${selectedCampaign.name} - Customer Satisfaction`, 
          createdBy: "Michael Brown", 
          lastRun: "2024-04-10", 
          schedule: "Weekly",
          status: 'active'
        }
      ] : [
        { 
          id: "1", 
          name: "Monthly Call Volume Analysis", 
          createdBy: "John Smith", 
          lastRun: "2024-04-15", 
          schedule: "Monthly",
          status: 'active'
        },
        { 
          id: "2", 
          name: "Agent Performance Summary", 
          createdBy: "Sarah Johnson", 
          lastRun: "2024-04-18", 
          schedule: "Weekly",
          status: 'active'
        },
        { 
          id: "3", 
          name: "Customer Satisfaction Trends", 
          createdBy: "Michael Brown", 
          lastRun: "2024-04-10", 
          schedule: "Quarterly",
          status: 'active'
        },
        { 
          id: "4", 
          name: "Compliance Violation Report", 
          createdBy: "Emily Davis", 
          lastRun: "2024-04-17", 
          schedule: "Daily",
          status: 'active'
        },
        { 
          id: "5", 
          name: "Campaign ROI Analysis", 
          createdBy: "David Wilson", 
          lastRun: "2024-04-05", 
          schedule: "On Demand",
          status: 'draft'
        },
        { 
          id: "6", 
          name: "Campaign Analysis", 
          createdBy: "Lisa Anderson",
          lastRun: "2024-03-10 15:30",
          schedule: "On Demand",
          status: 'draft'
        },
        { 
          id: "7", 
          name: "Standard Sales Report", 
          createdBy: "Robert Taylor",
          lastRun: "-",
          schedule: "-",
          status: 'draft',
          isTemplate: true
        },
        { 
          id: "8", 
          name: "Customer Feedback", 
          createdBy: "Jennifer Martinez",
          lastRun: "-",
          schedule: "-",
          status: 'draft',
          isTemplate: true
        }
      ];
      setReports(mockReports);
      setLoading(false);
    }, 500);
  }, [selectedCampaign]);

  const handleTabChange = (value: string) => {
    navigate(`/reports/${value}`);
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-400">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500/20 text-gray-400">Completed</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Draft</Badge>;
      default:
        return null;
    }
  };

  // Filter reports based on the active tab and search query
  const filteredReports = reports.filter(report => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'active' ? report.status === 'active' :
      activeTab === 'scheduled' ? report.status === 'scheduled' :
      activeTab === 'templates' ? report.isTemplate === true :
      true;
    
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Reports: {campaignName}
        </h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-400" />
                          {report.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {report.createdBy}
                        </div>
                      </TableCell>
                      <TableCell>{report.lastRun}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {report.schedule}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(report.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {!isFiltered && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Select a campaign from the sidebar to view campaign-specific reports.
          </p>
        </div>
      )}
    </div>
  );
}
