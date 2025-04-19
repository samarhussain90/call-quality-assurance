import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Brain, 
    CheckCircle, 
    Clock, 
    Download, 
    RefreshCw, 
    Upload, 
    XCircle 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FeedbackItem {
    id: string;
    text: string;
    type: 'correction' | 'improvement' | 'bug';
    correction?: string;
    status: 'pending' | 'reviewed' | 'implemented';
    date: string;
}

interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    trainingExamples: number;
    lastTrainingDate: string;
}

export function ModelTraining() {
    const [activeTab, setActiveTab] = useState("overview");
    const [isTraining, setIsTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingFeedback, setTrainingFeedback] = useState<FeedbackItem[]>([
        {
            id: "1",
            text: "The model sometimes misinterprets customer intent",
            type: "improvement",
            status: "pending",
            date: "2024-03-15T10:00:00Z"
        },
        {
            id: "2",
            text: "Improve handling of technical terms",
            type: "correction",
            correction: "Add technical glossary",
            status: "reviewed",
            date: "2024-03-14T15:30:00Z"
        },
        {
            id: "3",
            text: "Fix issue with sentiment analysis on complex sentences",
            type: "bug",
            status: "implemented",
            date: "2024-03-13T09:15:00Z"
        }
    ]);
    const [newFeedback, setNewFeedback] = useState("");

    const mockMetrics: ModelMetrics = {
        accuracy: 0.92,
        precision: 0.89,
        recall: 0.94,
        f1Score: 0.91,
        trainingExamples: 1250,
        lastTrainingDate: "2024-03-15"
    };

    const mockFeedback: FeedbackItem[] = [
        {
            id: "f1",
            type: "transcript",
            text: "The customer said they want to cancel their subscription",
            correction: "The customer expressed interest in canceling their subscription",
            status: "pending",
            date: "2024-03-15"
        },
        {
            id: "f2",
            type: "sentiment",
            text: "Negative sentiment detected",
            correction: "Neutral sentiment with slight frustration",
            status: "applied",
            date: "2024-03-14"
        }
    ];

    const handleFeedbackAction = (id: string, action: "apply" | "reject") => {
        const updatedFeedback = mockFeedback.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: action === "apply" ? "applied" : "rejected"
                };
            }
            return item;
        });
        // In a real implementation, this would update the backend
        console.log("Updated feedback:", updatedFeedback);
    };

    const startTraining = () => {
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

    const saveFeedback = async (feedback: FeedbackItem[]): Promise<void> => {
        // In a real implementation, this would make an API call to save the feedback
        return new Promise((resolve) => setTimeout(resolve, 500));
    };

    const handleFeedbackSubmit = async (feedback: string) => {
        try {
            const newFeedback: FeedbackItem = {
                id: Date.now().toString(),
                text: feedback,
                type: 'improvement',
                status: 'pending',
                date: new Date().toISOString()
            };
            const updatedFeedback = [...trainingFeedback, newFeedback];
            setTrainingFeedback(updatedFeedback);
            await saveFeedback(updatedFeedback);
            toast({
                title: "Feedback submitted",
                description: "Your feedback has been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save feedback. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Model Training</CardTitle>
                        <Button 
                            onClick={startTraining} 
                            disabled={isTraining}
                        >
                            {isTraining ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Training...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-4 h-4 mr-2" />
                                    Start Training
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Model Metrics */}
                        <div className="grid grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold">{mockMetrics.accuracy.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground">Accuracy</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold">{mockMetrics.precision.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground">Precision</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold">{mockMetrics.recall.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground">Recall</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold">{mockMetrics.f1Score.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground">F1 Score</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Training Progress */}
                        {isTraining && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Training Progress</span>
                                            <span>{trainingProgress}%</span>
                                        </div>
                                        <Progress value={trainingProgress} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Feedback Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Training Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {trainingFeedback.map((feedback) => (
                                        <div key={feedback.id} className="border rounded-lg p-4 mb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium">{feedback.text}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(feedback.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        feedback.status === "pending"
                                                            ? "secondary"
                                                            : feedback.status === "reviewed"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                >
                                                    {feedback.status}
                                                </Badge>
                                            </div>
                                            {feedback.correction && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Correction: {feedback.correction}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 