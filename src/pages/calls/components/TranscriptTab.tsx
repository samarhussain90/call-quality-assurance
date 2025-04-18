import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Search, 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";

interface TranscriptSegment {
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
}

interface TranscriptTabProps {
  callId: string;
  transcript: TranscriptSegment[];
  summary: {
    keyTakeaways: string[];
    actionItems: string[];
    coachingTips: string[];
  };
}

export function TranscriptTab({ callId, transcript, summary }: TranscriptTabProps) {
  const [activeTab, setActiveTab] = useState("transcript");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // Mock audio URL - in production, this would come from the API
  const audioUrl = `/api/calls/${callId}/audio`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current || !transcriptRef.current) return;

    const currentTime = audioRef.current.currentTime;
    const segments = transcriptRef.current.querySelectorAll('[data-timestamp]');
    
    for (const segment of segments) {
      const timestamp = parseFloat(segment.getAttribute('data-timestamp') || '0');
      if (currentTime >= timestamp && currentTime < timestamp + 5) {
        setCurrentSegment(segment.id);
        segment.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const filteredTranscript = transcript.filter(segment => 
    segment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSentimentVariant = (sentiment: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (sentiment) {
      case "positive":
        return "secondary";
      case "negative":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getComplianceVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "compliant":
        return "secondary";
      case "non-compliant":
        return "destructive";
      case "warning":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <audio ref={audioRef} src={audioUrl} className="hidden" />
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayback}
          className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 text-white border-gray-700"
          />
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("transcript")}
          className={`pb-2 px-4 ${
            activeTab === "transcript"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Transcript
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`pb-2 px-4 ${
            activeTab === "summary"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          AI Summary
        </button>
      </div>

      {activeTab === "transcript" ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div ref={transcriptRef} className="space-y-4">
              {filteredTranscript.map((segment) => (
                <div
                  key={segment.id}
                  id={segment.id}
                  data-timestamp={segment.timestamp}
                  className={`p-4 rounded-lg ${
                    currentSegment === segment.id
                      ? 'bg-gray-700'
                      : 'bg-gray-900'
                  } ${
                    segment.speaker === 'agent'
                      ? 'border-l-4 border-blue-500'
                      : 'border-l-4 border-green-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={`${
                        segment.speaker === 'agent'
                          ? 'bg-blue-900 text-blue-200 border-blue-700'
                          : 'bg-green-900 text-green-200 border-green-700'
                      }`}
                    >
                      {segment.speaker}
                    </Badge>
                    <span className="text-sm text-gray-400">{segment.timestamp}</span>
                  </div>
                  <p className="text-white">{segment.text}</p>
                  {segment.sentiment && (
                    <Badge
                      variant={getSentimentVariant(segment.sentiment)}
                      className="mt-2"
                    >
                      {segment.sentiment}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summary.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="text-gray-400 flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summary.actionItems.map((item, index) => (
                  <li key={index} className="text-gray-400 flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Coaching Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summary.coachingTips.map((tip, index) => (
                  <li key={index} className="text-gray-400 flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 