import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Search, FileText, Calendar, User } from "lucide-react";

export function CustomReports() {
  // Mock data for demonstration
  const reports = [
    { 
      id: 1, 
      name: "Monthly Call Volume Analysis", 
      createdBy: "John Smith", 
      lastRun: "2024-04-15", 
      schedule: "Monthly",
      status: "Active"
    },
    { 
      id: 2, 
      name: "Agent Performance Summary", 
      createdBy: "Sarah Johnson", 
      lastRun: "2024-04-18", 
      schedule: "Weekly",
      status: "Active"
    },
    { 
      id: 3, 
      name: "Customer Satisfaction Trends", 
      createdBy: "Michael Brown", 
      lastRun: "2024-04-10", 
      schedule: "Quarterly",
      status: "Active"
    },
    { 
      id: 4, 
      name: "Compliance Violation Report", 
      createdBy: "Emily Davis", 
      lastRun: "2024-04-17", 
      schedule: "Daily",
      status: "Active"
    },
    { 
      id: 5, 
      name: "Campaign ROI Analysis", 
      createdBy: "David Wilson", 
      lastRun: "2024-04-05", 
      schedule: "On Demand",
      status: "Inactive"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Custom Reports</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8 bg-gray-800 border-gray-700"
              />
            </div>
          </div>

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
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-400" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-blue-400" />
                  <div>
                    <p className="font-medium">Call Volume Report</p>
                    <p className="text-sm text-gray-400">Standard template for call volume analysis</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Use</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-green-400" />
                  <div>
                    <p className="font-medium">Agent Performance Report</p>
                    <p className="text-sm text-gray-400">Template for agent performance metrics</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Use</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-purple-400" />
                  <div>
                    <p className="font-medium">Compliance Report</p>
                    <p className="text-sm text-gray-400">Template for compliance monitoring</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Use</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Monthly Call Volume Analysis</p>
                  <p className="text-xs text-gray-400">Next run: May 1, 2024</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Weekly Agent Performance Summary</p>
                  <p className="text-xs text-gray-400">Next run: April 25, 2024</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Daily Compliance Violation Report</p>
                  <p className="text-xs text-gray-400">Next run: April 19, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 