import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Clock, ChevronRight, Play, Settings, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AIAssistantPage() {
  const [message, setMessage] = useState<string>("");
  const [conversations, setConversations] = useState([
    { 
      id: "conv1", 
      title: "Call Analysis Help", 
      date: "2 hours ago", 
      lastMessage: "How can I interpret these quality scores?",
      unread: false
    },
    { 
      id: "conv2", 
      title: "Campaign Setup", 
      date: "1 day ago", 
      lastMessage: "What's the best way to segment my contact list?",
      unread: true
    },
    { 
      id: "conv3", 
      title: "Compliance Rules", 
      date: "3 days ago", 
      lastMessage: "Can you help me understand these new regulations?",
      unread: false
    }
  ]);
  
  const [activeChat, setActiveChat] = useState([
    { id: "1", type: "assistant", content: "Hello! How can I assist you today with your call quality and compliance needs?", timestamp: "10:30 AM" },
    { id: "2", type: "user", content: "I need help understanding the latest compliance report.", timestamp: "10:31 AM" },
    { id: "3", type: "assistant", content: "I'd be happy to help with that. The compliance report shows your team's adherence to script requirements and regulatory guidelines. Is there a specific section you're concerned about?", timestamp: "10:32 AM" },
    { id: "4", type: "user", content: "Yes, I'm not sure what the 'disclosure rate' metric means.", timestamp: "10:33 AM" },
    { id: "5", type: "assistant", content: "The 'disclosure rate' measures how often your agents properly disclose required information to customers. This includes things like call recording notifications, privacy policies, and terms of service. A higher rate is better, with 100% being the goal for full compliance. Would you like me to analyze your current rate and suggest improvements?", timestamp: "10:34 AM" }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setActiveChat([...activeChat, newMessage]);
      setMessage("");
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "I'm analyzing your disclosure rate data now. Based on your last 100 calls, your agents have a 87% disclosure rate. The main issues appear to be with the privacy policy disclosures and call recording notifications. I recommend reviewing your call scripts and providing additional training focused on these specific disclosures.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setActiveChat(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">Get AI-powered help with your call quality and compliance tasks</p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Assistant Settings
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Conversations</span>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map(conv => (
                  <div 
                    key={conv.id}
                    className="flex items-start p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate max-w-[140px]">{conv.title}</p>
                        <div className="flex items-center">
                          {conv.unread && (
                            <Badge variant="secondary" className="rounded-full h-2 w-2 bg-blue-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-[180px]">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conv.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <Tabs defaultValue="chat">
              <div className="flex justify-between items-center p-4 border-b">
                <TabsList>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="training">Model Training</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Conversation
                </Button>
              </div>
              
              <TabsContent value="chat" className="m-0">
                <CardContent className="p-0">
                  <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {activeChat.map(msg => (
                        <div 
                          key={msg.id}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <Avatar className={`h-8 w-8 ${msg.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                              <AvatarFallback className={msg.type === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-gray-200'}>
                                {msg.type === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div 
                                className={`rounded-lg p-3 text-sm ${
                                  msg.type === 'assistant' 
                                    ? 'bg-primary/10 text-foreground' 
                                    : 'bg-primary text-primary-foreground'
                                }`}
                              >
                                {msg.content}
                              </div>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {msg.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t flex items-end gap-2">
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 min-h-[80px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <Button onClick={handleSendMessage} type="submit">
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                        <Button variant="outline" type="button">
                          <Play className="h-4 w-4 mr-2" />
                          Voice
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="tools" className="m-0 p-6">
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">AI Tools</h3>
                  <p className="text-muted-foreground mb-4">Access specialized tools for call analysis, script generation, and compliance checking</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Call Analyzer</h4>
                        <p className="text-sm text-muted-foreground">Analyze call recordings for quality and compliance</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Script Generator</h4>
                        <p className="text-sm text-muted-foreground">Create compliant call scripts with AI</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Compliance Check</h4>
                        <p className="text-sm text-muted-foreground">Verify compliance with regulations</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="training" className="m-0 p-6">
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Model Training</h3>
                  <p className="text-muted-foreground mb-4">Train the assistant on your specific use cases and compliance requirements</p>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
} 