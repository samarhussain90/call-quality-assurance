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
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  const getComplianceStatus = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Compliant</span>
          </div>
        );
      case "non-compliant":
        return (
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400">Non-compliant</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">Warning</span>
          </div>
        );
      default:
        return null;
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
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/50">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Total Duration</p>
                <p className="text-white font-medium">{metrics.duration.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/50">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Agent Speaking</p>
                <p className="text-white font-medium">{metrics.duration.agent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/50">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Customer Speaking</p>
                <p className="text-white font-medium">{metrics.duration.customer}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/50">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Silence</p>
                <p className="text-white font-medium">{metrics.duration.silence}</p>
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
                <span className="text-sm text-white font-medium">{metrics.speaking.agent}%</span>
              </div>
              <Progress 
                value={metrics.speaking.agent} 
                className="h-2 bg-gray-700 [&>div]:bg-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Customer Speaking Time</span>
                <span className="text-sm text-white font-medium">{metrics.speaking.customer}%</span>
              </div>
              <Progress 
                value={metrics.speaking.customer} 
                className="h-2 bg-gray-700 [&>div]:bg-green-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Interruptions</span>
                <span className="text-sm text-white font-medium">{metrics.speaking.interruptions}</span>
              </div>
              <Progress 
                value={Math.min(metrics.speaking.interruptions * 20, 100)} 
                className="h-2 bg-gray-700 [&>div]:bg-yellow-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Overall Quality Score</span>
                <span className="text-sm text-white font-medium">{metrics.quality.score}%</span>
              </div>
              <Progress 
                value={metrics.quality.score} 
                className={`h-2 bg-gray-700 [&>div]:${
                  metrics.quality.score >= 80 
                    ? "bg-green-500" 
                    : metrics.quality.score >= 60 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-gray-900/50">
                <div className="flex items-center gap-2 mb-2">
                  {getTrendIcon(metrics.quality.trends.clarity)}
                  <span className="text-sm text-gray-400">Clarity</span>
                </div>
                <Badge 
                  variant="outline"
                  className={`${
                    metrics.quality.trends.clarity === "up"
                      ? "bg-green-900/20 text-green-400 border-green-800"
                      : metrics.quality.trends.clarity === "down"
                      ? "bg-red-900/20 text-red-400 border-red-800"
                      : "bg-gray-900/20 text-gray-400 border-gray-800"
                  }`}
                >
                  {metrics.quality.trends.clarity}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/50">
                <div className="flex items-center gap-2 mb-2">
                  {getTrendIcon(metrics.quality.trends.empathy)}
                  <span className="text-sm text-gray-400">Empathy</span>
                </div>
                <Badge 
                  variant="outline"
                  className={`${
                    metrics.quality.trends.empathy === "up"
                      ? "bg-green-900/20 text-green-400 border-green-800"
                      : metrics.quality.trends.empathy === "down"
                      ? "bg-red-900/20 text-red-400 border-red-800"
                      : "bg-gray-900/20 text-gray-400 border-gray-800"
                  }`}
                >
                  {metrics.quality.trends.empathy}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/50">
                <div className="flex items-center gap-2 mb-2">
                  {getTrendIcon(metrics.quality.trends.professionalism)}
                  <span className="text-sm text-gray-400">Professionalism</span>
                </div>
                <Badge 
                  variant="outline"
                  className={`${
                    metrics.quality.trends.professionalism === "up"
                      ? "bg-green-900/20 text-green-400 border-green-800"
                      : metrics.quality.trends.professionalism === "down"
                      ? "bg-red-900/20 text-red-400 border-red-800"
                      : "bg-gray-900/20 text-gray-400 border-gray-800"
                  }`}
                >
                  {metrics.quality.trends.professionalism}
                </Badge>
              </div>
            </div>

            {metrics.quality.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Quality Issues</h4>
                <div className="space-y-2">
                  {metrics.quality.issues.map((issue, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg bg-gray-900/50"
                    >
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <p className="text-sm text-gray-300">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getComplianceStatus(metrics.compliance.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Score:</span>
                <span className="text-sm text-white font-medium">{metrics.compliance.score}%</span>
              </div>
            </div>

            {metrics.compliance.violations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Violations</h4>
                <div className="space-y-2">
                  {metrics.compliance.violations.map((violation, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg bg-gray-900/50"
                    >
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                      <p className="text-sm text-gray-300">{violation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 