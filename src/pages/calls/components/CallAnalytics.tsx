import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";

interface CallAnalyticsProps {
  callId: string;
  metrics: {
    duration: {
      total: string;
      agent: string;
      customer: string;
      silence: string;
    };
    speaking: {
      agent: number;
      customer: number;
      interruptions: number;
    };
    compliance: {
      status: "compliant" | "non-compliant" | "warning";
      violations: string[];
      score: number;
    };
    quality: {
      score: number;
      issues: string[];
      trends: {
        clarity: "up" | "down" | "stable";
        empathy: "up" | "down" | "stable";
        professionalism: "up" | "down" | "stable";
      };
    };
  };
}

export function CallAnalytics({ callId, metrics }: CallAnalyticsProps) {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'non-compliant':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Duration Analysis */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Duration Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Total Duration</p>
                <p className="text-white">{metrics.duration.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Agent Speaking</p>
                <p className="text-white">{metrics.duration.agent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Customer Speaking</p>
                <p className="text-white">{metrics.duration.customer}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Silence</p>
                <p className="text-white">{metrics.duration.silence}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speaking Patterns */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Speaking Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Agent Speaking Time</span>
                <span className="text-sm text-white">{metrics.speaking.agent}%</span>
              </div>
              <Progress value={metrics.speaking.agent} className="h-2 bg-gray-700" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Customer Speaking Time</span>
                <span className="text-sm text-white">{metrics.speaking.customer}%</span>
              </div>
              <Progress value={metrics.speaking.customer} className="h-2 bg-gray-700" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Interruptions</span>
                <span className="text-sm text-white">{metrics.speaking.interruptions}</span>
              </div>
              <Progress 
                value={Math.min(metrics.speaking.interruptions * 20, 100)} 
                className="h-2 bg-gray-700" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Quality Metrics</CardTitle>
            <Badge variant="outline" className="text-lg bg-gray-900 text-white border-gray-700">
              {metrics.quality.score}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded-lg">
                <span className="text-sm text-gray-400">Clarity</span>
                {getTrendIcon(metrics.quality.trends.clarity)}
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded-lg">
                <span className="text-sm text-gray-400">Empathy</span>
                {getTrendIcon(metrics.quality.trends.empathy)}
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded-lg">
                <span className="text-sm text-gray-400">Professionalism</span>
                {getTrendIcon(metrics.quality.trends.professionalism)}
              </div>
            </div>
            {metrics.quality.issues.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-white mb-2">Quality Issues</h4>
                <ul className="space-y-2">
                  {metrics.quality.issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Compliance Status</CardTitle>
            <Badge 
              variant={metrics.compliance.status === 'compliant' ? 'secondary' : 'destructive'}
              className="bg-gray-900 text-white border-gray-700"
            >
              {getComplianceIcon(metrics.compliance.status)}
              <span className="ml-1 capitalize">{metrics.compliance.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Compliance Score</span>
                <span className="text-sm text-white">{metrics.compliance.score}%</span>
              </div>
              <Progress 
                value={metrics.compliance.score} 
                className={`h-2 ${
                  metrics.compliance.score >= 90 
                    ? 'bg-green-500' 
                    : metrics.compliance.score >= 70 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
              />
            </div>
            {metrics.compliance.violations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Violations</h4>
                <ul className="space-y-2">
                  {metrics.compliance.violations.map((violation, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                      <XCircle className="h-4 w-4 text-red-500" />
                      {violation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 