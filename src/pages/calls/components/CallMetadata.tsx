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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'non-compliant':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
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
          <h3 className="text-sm font-medium mb-2 text-white">Call Quality</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg bg-gray-900 text-white border-gray-700">
              {metadata.quality.score}%
            </Badge>
            {metadata.quality.issues.length > 0 && (
              <span className="text-sm text-gray-400">
                ({metadata.quality.issues.length} issues detected)
              </span>
            )}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Compliance Status */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-white">Compliance Status</h3>
          <div className="flex items-center gap-2">
            <Badge 
              variant={metadata.compliance.status === 'compliant' ? 'secondary' : 'destructive'}
              className="bg-gray-900 text-white border-gray-700"
            >
              {getComplianceIcon(metadata.compliance.status)}
              <span className="ml-1 capitalize">{metadata.compliance.status}</span>
            </Badge>
          </div>
          {metadata.compliance.violations.length > 0 && (
            <ul className="mt-2 text-sm text-gray-400">
              {metadata.compliance.violations.map((violation, index) => (
                <li key={index} className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  {violation}
                </li>
              ))}
            </ul>
          )}
        </div>

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
                  className="bg-gray-900 text-white border-gray-700"
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
                  className="bg-gray-900 text-white border-gray-700"
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
              className="bg-gray-900 text-white border-gray-700"
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
