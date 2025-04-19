import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, BarChart, Zap, Bot } from "lucide-react";

export function SettingsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract the current tab from the URL path
    const currentPath = location.pathname.split('/').pop() || 'general';
    
    const handleTabChange = (value: string) => {
        navigate(`/settings/${value}`);
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <Card className="p-6">
                <Tabs value={currentPath} onValueChange={handleTabChange}>
                    <TabsList className="grid grid-cols-5 gap-4">
                        <TabsTrigger value="general" className="flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="compliance" className="flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Compliance Rules
                        </TabsTrigger>
                        <TabsTrigger value="agent-analytics" className="flex items-center">
                            <BarChart className="w-4 h-4 mr-2" />
                            Agent Analytics
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            Integrations
                        </TabsTrigger>
                        <TabsTrigger value="model-training" className="flex items-center">
                            <Bot className="w-4 h-4 mr-2" />
                            Model Training
                        </TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <Outlet />
                    </div>
                </Tabs>
            </Card>
        </div>
    );
}
