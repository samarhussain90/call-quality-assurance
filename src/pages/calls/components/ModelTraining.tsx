import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart2,
  Settings,
  Download,
  Upload
} from "lucide-react";

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingExamples: number;
  lastTrainingDate: string;
  nextTrainingDate: string;
}

interface FeedbackItem {
  id: string;
  type: "correction" | "improvement" | "bug";
  description: string;
  timestamp: string;
  impact: "high" | "medium" | "low";
  status: "pending" | "applied" | "rejected";
}

interface ModelTrainingProps {
  onModelUpdate?: (metrics: ModelMetrics) => void;
}

export function ModelTraining({ onModelUpdate }: ModelTrainingProps) {
  const [metrics, setMetrics] = useState<ModelMetrics>({
    accuracy: 92.5,
    precision: 91.8,
    recall: 93.2,
    f1Score: 92.5,
    trainingExamples: 15000,
    lastTrainingDate: "2024-02-15T10:00:00Z",
    nextTrainingDate: "2024-02-22T10:00:00Z"
  });

  const [feedback, setFeedback] = useState<FeedbackItem[]>([
    {
      id: "1",
      type: "correction",
      description: "Improve sentiment analysis for sarcastic comments",
      status: "pending",
      timestamp: "2024-02-20T09:30:00Z",
      impact: "high"
    },
    {
      id: "2",
      type: "improvement",
      description: "Add support for technical jargon in IT support calls",
      status: "applied",
      timestamp: "2024-02-19T15:45:00Z",
      impact: "medium"
    },
    {
      id: "3",
      type: "bug",
      description: "Fix false positives in compliance detection",
      status: "rejected",
      timestamp: "2024-02-18T11:20:00Z",
      impact: "high"
    }
  ]);

  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleFeedbackAction = (id: string, action: "apply" | "reject") => {
    const updatedFeedback = feedback.map(item => 
      item.id === id ? { ...item, status: (action === "apply" ? "applied" : "rejected") as "pending" | "applied" | "rejected" } : item
    );
    setFeedback(updatedFeedback);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Model Training & Improvement</h2>
        <Button 
          variant="outline" 
          onClick={handleStartTraining}
          disabled={isTraining}
          className="text-white border-gray-700 hover:bg-gray-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isTraining ? "animate-spin" : ""}`} />
          {isTraining ? "Training..." : "Start Training"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Metrics */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Accuracy</span>
                  <span className="text-sm font-medium text-white">{metrics.accuracy}%</span>
                </div>
                <Progress value={metrics.accuracy} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Precision</span>
                  <span className="text-sm font-medium text-white">{metrics.precision}%</span>
                </div>
                <Progress value={metrics.precision} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Recall</span>
                  <span className="text-sm font-medium text-white">{metrics.recall}%</span>
                </div>
                <Progress value={metrics.recall} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">F1 Score</span>
                  <span className="text-sm font-medium text-white">{metrics.f1Score}%</span>
                </div>
                <Progress value={metrics.f1Score} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Training Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Training Examples</span>
                  <span className="text-sm font-medium text-white">{metrics.trainingExamples.toLocaleString()}</span>
                </div>
                <Progress value={(metrics.trainingExamples / 20000) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Last Training</span>
                  <span className="text-sm font-medium text-white">
                    {new Date(metrics.lastTrainingDate).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Next Scheduled Training</span>
                  <span className="text-sm font-medium text-white">
                    {new Date(metrics.nextTrainingDate).toLocaleString()}
                  </span>
                </div>
              </div>
              {isTraining && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Current Training Progress</span>
                    <span className="text-sm font-medium text-white">{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Loop */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Feedback Loop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback.map((item) => (
              <div 
                key={item.id}
                className="flex items-start justify-between p-4 rounded bg-gray-700/50"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium text-white">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getImpactColor(item.impact)}`}
                    >
                      {item.impact} impact
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                {item.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedbackAction(item.id, "apply")}
                      className="text-white hover:bg-gray-700"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedbackAction(item.id, "reject")}
                      className="text-white hover:bg-gray-700"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 