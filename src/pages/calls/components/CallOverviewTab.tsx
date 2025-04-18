import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Circle, Plus, X, Tag, MessageSquare, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CallOverviewTabProps {
  callId: string;
}

interface ScoreMetric {
  name: string;
  score: number;
  weight: number;
  issues?: string[];
}

export function CallOverviewTab({ callId }: CallOverviewTabProps) {
  const [activeTab, setActiveTab] = useState("Summary");
  const [notes, setNotes] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>(["Important", "Follow-up"]);

  // Mock scoring data
  const scoreMetrics: ScoreMetric[] = [
    { name: "Communication", score: 85, weight: 0.3, issues: ["Could improve clarity"] },
    { name: "Problem Solving", score: 90, weight: 0.25 },
    { name: "Compliance", score: 95, weight: 0.2 },
    { name: "Customer Experience", score: 88, weight: 0.25, issues: ["Response time could be better"] }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleSaveNotes = () => {
    // TODO: Implement save notes functionality
    console.log("Saving notes:", notes);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Call Details */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Call Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-white">Duration</h3>
              <p className="text-gray-400">15:23</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Date & Time</h3>
              <p className="text-gray-400">March 15, 2024 - 2:30 PM</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Agent</h3>
              <p className="text-gray-400">John Smith</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Campaign</h3>
              <p className="text-gray-400">Q1 Sales Outreach</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Scoring */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Call Scoring</CardTitle>
            <Badge variant="outline" className="text-lg bg-gray-900 text-white border-gray-700">
              89%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoreMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{metric.name}</span>
                  <span className={`text-sm font-medium ${getScoreColor(metric.score)}`}>
                    {metric.score}%
                  </span>
                </div>
                <Progress 
                  value={metric.score} 
                  className={`h-2 ${getScoreBackground(metric.score)}`}
                />
                {metric.issues && (
                  <ul className="mt-1 text-xs text-gray-400">
                    {metric.issues.map((issue, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <Circle className="h-2 w-2" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about this call..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] bg-gray-900 text-white border-gray-700"
          />
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-900 text-white border-gray-700"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-gray-800"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            />
            <Button
              onClick={handleAddTag}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

