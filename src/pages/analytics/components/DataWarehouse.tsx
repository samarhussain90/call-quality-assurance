import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, Search, Filter, Database } from "lucide-react";

export function DataWarehouse() {
  // Mock data for demonstration
  const dataSources = [
    { id: 1, name: "Call Transcripts", records: 12500, lastUpdated: "2024-04-18", status: "Active" },
    { id: 2, name: "Customer Feedback", records: 3200, lastUpdated: "2024-04-17", status: "Active" },
    { id: 3, name: "Agent Performance", records: 4500, lastUpdated: "2024-04-18", status: "Active" },
    { id: 4, name: "Campaign Results", records: 7800, lastUpdated: "2024-04-16", status: "Active" },
    { id: 5, name: "Compliance Logs", records: 5600, lastUpdated: "2024-04-18", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Warehouse</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search data sources..."
                className="pl-8 bg-gray-800 border-gray-700"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 text-blue-400" />
                      {source.name}
                    </div>
                  </TableCell>
                  <TableCell>{source.records.toLocaleString()}</TableCell>
                  <TableCell>{source.lastUpdated}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {source.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
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
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Used: 2.4 GB</span>
                <span>Total: 10 GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "24%" }}></div>
              </div>
              <p className="text-sm text-gray-400">
                Your data warehouse is using 24% of the allocated storage.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Data import completed</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">New data source added</p>
                  <p className="text-xs text-gray-400">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Data export scheduled</p>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 