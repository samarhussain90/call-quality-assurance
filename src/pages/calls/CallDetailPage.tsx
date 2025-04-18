import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallOverviewTab } from "./components/CallOverviewTab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Clock, User, Building } from "lucide-react";
import { CallMetadata } from "./components/CallMetadata";
import { TranscriptTab } from "./components/TranscriptTab";
import { apiFetchCallDetails } from "@/api/index";
import { CallAnalytics } from "./components/CallAnalytics";

interface CallDetails {
  id: string;
  status: string;
  duration: string;
  date: string;
  time: string;
  agent: string;
  customer: string;
  company: string;
  phoneNumber: string;
  quality?: {
    score: number;
    issues: string[];
    trends: {
      clarity: "up" | "down" | "stable";
      empathy: "up" | "down" | "stable";
      professionalism: "up" | "down" | "stable";
    };
  };
  compliance?: {
    status: "compliant" | "non-compliant" | "warning";
    violations: string[];
    score: number;
  };
  keywords?: string[];
  topics?: string[];
  sentiment?: {
    overall: "positive" | "negative" | "neutral";
    score: number;
  };
  analytics?: {
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
  };
  transcript?: {
    segments: {
      id: string;
      timestamp: string;
      speaker: "agent" | "customer";
      text: string;
      sentiment?: "positive" | "negative" | "neutral";
      quality?: {
        score: number;
        issues: string[];
      };
      compliance?: {
        status: "compliant" | "warning" | "non-compliant";
        violations: string[];
      };
    }[];
    summary: {
      keyTakeaways: string[];
      actionItems: string[];
      coachingTips: string[];
    };
  };
}

export function CallDetailPage() {
  const { callId } = useParams<{ callId: string }>();
  const [call, setCall] = useState<CallDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCallDetails = async () => {
      setLoading(true);
      try {
        const callData = await apiFetchCallDetails(callId || "");
        
        // Format the call data
        const formattedCall: CallDetails = {
          id: callData.id,
          status: callData.status,
          duration: callData.duration,
          date: callData.date.split('T')[0], // Extract date part
          time: callData.date.split('T')[1].substring(0, 5), // Extract time part
          agent: callData.agent,
          customer: "Customer Name", // Mock data
          company: "Customer Company", // Mock data
          phoneNumber: "+1 (555) 123-4567", // Mock data
          quality: callData.quality,
          compliance: callData.compliance,
          keywords: callData.keywords,
          topics: callData.topics,
          sentiment: callData.sentiment,
          analytics: callData.analytics,
          // Add mock transcript data
          transcript: {
            segments: [
              {
                id: "1",
                timestamp: "00:00",
                speaker: "agent",
                text: "Hello, thank you for calling TechSupport. How can I help you today?",
                sentiment: "positive"
              },
              {
                id: "2",
                timestamp: "00:05",
                speaker: "customer",
                text: "Hi, I'm having trouble with my computer. It's running really slow.",
                sentiment: "negative"
              },
              {
                id: "3",
                timestamp: "00:10",
                speaker: "agent",
                text: "I'm sorry to hear that. Let me help you troubleshoot. Can you tell me what operating system you're using?",
                sentiment: "positive"
              },
              {
                id: "4",
                timestamp: "00:15",
                speaker: "customer",
                text: "I'm using Windows 10.",
                sentiment: "neutral"
              },
              {
                id: "5",
                timestamp: "00:20",
                speaker: "agent",
                text: "Thank you. Have you noticed any specific programs that are causing the slowdown?",
                sentiment: "positive"
              },
              {
                id: "6",
                timestamp: "00:25",
                speaker: "customer",
                text: "Not really, it's just generally slow. Sometimes it freezes completely.",
                sentiment: "negative"
              },
              {
                id: "7",
                timestamp: "00:30",
                speaker: "agent",
                text: "I understand your frustration. Let's try a few things to improve performance. First, let's check your task manager to see what processes are using the most resources.",
                sentiment: "positive",
                quality: {
                  score: 90,
                  issues: []
                }
              },
              {
                id: "8",
                timestamp: "00:35",
                speaker: "customer",
                text: "Okay, how do I do that?",
                sentiment: "neutral"
              },
              {
                id: "9",
                timestamp: "00:40",
                speaker: "agent",
                text: "Press Ctrl+Shift+Esc to open Task Manager. Look for any programs using a high percentage of CPU or memory.",
                sentiment: "positive",
                quality: {
                  score: 85,
                  issues: ["Could provide more detailed instructions"]
                }
              },
              {
                id: "10",
                timestamp: "00:45",
                speaker: "customer",
                text: "I see a program called 'Cryptominer' using 90% of my CPU. Is that normal?",
                sentiment: "negative"
              },
              {
                id: "11",
                timestamp: "00:50",
                speaker: "agent",
                text: "No, that's not normal at all! It sounds like your computer might be infected with malware. Let's run a full system scan immediately.",
                sentiment: "negative",
                quality: {
                  score: 95,
                  issues: []
                },
                compliance: {
                  status: "warning",
                  violations: ["Should have mentioned security protocols earlier"]
                }
              }
            ],
            summary: {
              keyTakeaways: [
                "Customer experiencing slow computer performance",
                "Agent identified potential malware (Cryptominer) using 90% CPU",
                "Customer needs immediate malware scan and removal"
              ],
              actionItems: [
                "Schedule follow-up call to confirm malware removal",
                "Send customer instructions for running full system scan",
                "Recommend security software installation"
              ],
              coachingTips: [
                "Agent showed good empathy when customer expressed frustration",
                "Agent should have asked about security software earlier in the call",
                "Consider providing more detailed step-by-step instructions for technical tasks"
              ]
            }
          }
        };
        
        setCall(formattedCall);
      } catch (error) {
        console.error("Error fetching call details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallDetails();
  }, [callId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading call details...</div>;
  }

  if (!call) {
    return <div className="flex items-center justify-center h-64 text-red-500">Call not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Call Details</h1>
          <p className="text-gray-400">Call ID: {call.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={call.status === "Completed" ? "default" : "secondary"}>
            {call.status}
          </Badge>
          <Button variant="secondary">Download Recording</Button>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Call Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-white">{call.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Date & Time</p>
                <p className="text-white">{call.date} {call.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Agent</p>
                <p className="text-white">{call.agent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Company</p>
                <p className="text-white">{call.company}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {call.quality && call.compliance && call.keywords && call.topics && call.sentiment && (
        <CallMetadata metadata={{
          quality: call.quality,
          compliance: call.compliance,
          keywords: call.keywords,
          topics: call.topics,
          sentiment: call.sentiment
        }} />
      )}
      
      <div className="flex space-x-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2 px-4 ${
            activeTab === "overview"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Call Overview
        </button>
        <button
          onClick={() => setActiveTab("transcript")}
          className={`pb-2 px-4 ${
            activeTab === "transcript"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Transcript & Summary
        </button>
        <button
          onClick={() => setActiveTab("scorecard")}
          className={`pb-2 px-4 ${
            activeTab === "scorecard"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Scorecard
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-2 px-4 ${
            activeTab === "details"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Call Details
        </button>
        <button
          onClick={() => setActiveTab("vocalytics")}
          className={`pb-2 px-4 ${
            activeTab === "vocalytics"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Vocalytics™
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-2 px-4 ${
            activeTab === "questions"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Questions
        </button>
      </div>

      {activeTab === "overview" && (
        <CallOverviewTab callId={call.id} />
      )}
      
      {activeTab === "transcript" && (
        call.transcript ? (
          <TranscriptTab 
            callId={call.id} 
            transcript={call.transcript.segments} 
            summary={call.transcript.summary} 
          />
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <p className="text-gray-400">Transcript data not available for this call.</p>
            </CardContent>
          </Card>
        )
      )}
      
      {activeTab === "scorecard" && (
        call.analytics && call.quality && call.compliance ? (
          <CallAnalytics 
            callId={call.id}
            metrics={{
              duration: call.analytics.duration,
              speaking: call.analytics.speaking,
              compliance: {
                status: call.compliance.status,
                violations: call.compliance.violations,
                score: call.compliance.score
              },
              quality: {
                score: call.quality.score,
                issues: call.quality.issues,
                trends: call.quality.trends
              }
            }}
          />
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Scorecard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Analytics data not available for this call.</p>
            </CardContent>
          </Card>
        )
      )}
      
      {activeTab === "details" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Call Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Call details content coming soon...</p>
          </CardContent>
        </Card>
      )}
      
      {activeTab === "vocalytics" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Vocalytics™</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Vocalytics content coming soon...</p>
          </CardContent>
        </Card>
      )}
      
      {activeTab === "questions" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Questions content coming soon...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
