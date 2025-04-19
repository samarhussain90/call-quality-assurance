import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface CallMetadataProps {
  metadata: {
    quality: {
      score: number;
      issues: string[];
    };
    compliance: {
      status: "compliant" | "non-compliant" | "warning";
      violations: string[];
    };
    keywords: string[];
    topics: string[];
    sentiment: {
      overall: "positive" | "negative" | "neutral";
      score: number;
    };
  };
}

export function CallMetadata({ metadata }: CallMetadataProps) {
  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (sentiment) {
      case 'positive':
        return 'secondary';
      case 'negative':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Call Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quality Score */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-white">Quality Score</h3>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={`${
                metadata.quality.score >= 80
                  ? "bg-green-900/20 text-green-400 border-green-800"
                  : metadata.quality.score >= 60
                  ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                  : "bg-red-900/20 text-red-400 border-red-800"
              }`}
            >
              {metadata.quality.score}%
            </Badge>
          </div>
        </div>

        {/* Quality Issues */}
        {metadata.quality.issues.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Quality Issues</h3>
            <div className="space-y-2">
              {metadata.quality.issues.map((issue, index) => (
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

        <Separator className="bg-gray-700" />

        {/* Compliance Status */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-white">Compliance Status</h3>
          <div className="flex items-center gap-2">
            {getComplianceIcon(metadata.compliance.status)}
            <Badge 
              variant="outline"
              className={`${
                metadata.compliance.status === 'compliant'
                  ? "bg-green-900/20 text-green-400 border-green-800"
                  : metadata.compliance.status === 'warning'
                  ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                  : "bg-red-900/20 text-red-400 border-red-800"
              }`}
            >
              {metadata.compliance.status}
            </Badge>
          </div>
        </div>

        {/* Compliance Violations */}
        {metadata.compliance.violations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Violations</h3>
            <div className="space-y-2">
              {metadata.compliance.violations.map((violation, index) => (
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

        <Separator className="bg-gray-700" />

        {/* Keywords and Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {metadata.keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-gray-900/50 text-gray-300 border-gray-700"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {metadata.topics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-gray-900/50 text-gray-300 border-gray-700"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Sentiment Analysis */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-white">Sentiment Analysis</h3>
          <div className="flex items-center gap-2">
            <Badge 
              variant={getSentimentColor(metadata.sentiment.overall)}
              className={`${
                metadata.sentiment.overall === 'positive'
                  ? "bg-green-900/20 text-green-400 border-green-800"
                  : metadata.sentiment.overall === 'negative'
                  ? "bg-red-900/20 text-red-400 border-red-800"
                  : "bg-gray-900/20 text-gray-400 border-gray-800"
              }`}
            >
              {metadata.sentiment.overall}
            </Badge>
            <span className="text-sm text-gray-400">
              Score: {metadata.sentiment.score}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
