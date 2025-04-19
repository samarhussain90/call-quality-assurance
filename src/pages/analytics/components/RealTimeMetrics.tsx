import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown, 
  ArrowUp, 
  Clock, 
  Phone, 
  Users,
  CheckCircle
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Badge variant={isPositive ? "default" : "destructive"} className="mr-2">
            {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {Math.abs(change)}%
          </Badge>
          <span>from last hour</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function RealTimeMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Agents</p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
            </div>
            <div className="bg-green-500/10 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">12%</span>
            <span className="text-gray-400 ml-2">from last hour</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Calls</p>
              <h3 className="text-2xl font-bold mt-1">18</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-full">
              <Phone className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">8%</span>
            <span className="text-gray-400 ml-2">from last hour</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg. Call Duration</p>
              <h3 className="text-2xl font-bold mt-1">4m 32s</h3>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-full">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500">3%</span>
            <span className="text-gray-400 ml-2">from last hour</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <h3 className="text-2xl font-bold mt-1">92%</h3>
            </div>
            <div className="bg-green-500/10 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">5%</span>
            <span className="text-gray-400 ml-2">from last hour</span>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Calls</h3>
        <div className="space-y-4">
          {[
            { agent: "John Smith", duration: "2m 15s", status: "In Progress" },
            { agent: "Sarah Johnson", duration: "5m 42s", status: "In Progress" },
            { agent: "Mike Wilson", duration: "1m 30s", status: "In Progress" },
            { agent: "Emily Brown", duration: "3m 55s", status: "In Progress" },
          ].map((call, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  {call.agent.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{call.agent}</p>
                  <p className="text-sm text-gray-400">{call.duration}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                {call.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 