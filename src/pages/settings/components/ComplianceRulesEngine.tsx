import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import * as Tabs from "@radix-ui/react-tabs";
import { 
    AlertTriangle, 
    CheckCircle, 
    Clock,
    Code,
    MessageSquare,
    Plus, 
    Save, 
    Settings, 
    Trash2, 
    XCircle 
} from "lucide-react";

interface Condition {
    field: string;
    operator: string;
    value: any;
}

interface Action {
    type: string;
    target: string;
    value: any;
}

interface Rule {
    id: string;
    name: string;
    description: string;
    type: "keyword" | "sentiment" | "duration" | "topic" | "custom";
    severity: "low" | "medium" | "high" | "critical";
    conditions: Condition[];
    actions?: Action[];
    score_impact: number;
    is_active: boolean;
}

const mockRules: Rule[] = [
    {
        id: "1",
        name: "No Personal Information Sharing",
        description: "Flag when agents share customer personal information without verification",
        type: "keyword",
        severity: "critical",
        conditions: [
            { field: "transcript", operator: "contains", value: "social security" },
            { field: "transcript", operator: "contains", value: "credit card" }
        ],
        actions: [
            { type: "notify", target: "supervisor", value: "immediate" },
            { type: "flag", target: "compliance", value: "review" }
        ],
        score_impact: 25,
        is_active: true
    },
    {
        id: "2",
        name: "Minimum Call Duration",
        description: "Ensure calls meet minimum duration requirements",
        type: "duration",
        severity: "medium",
        conditions: [
            { field: "duration", operator: "less_than", value: 60 }
        ],
        actions: [
            { type: "notify", target: "agent", value: "coaching" }
        ],
        score_impact: 10,
        is_active: true
    },
    {
        id: "3",
        name: "Negative Sentiment Alert",
        description: "Alert when customer sentiment becomes highly negative",
        type: "sentiment",
        severity: "high",
        conditions: [
            { field: "sentiment", operator: "less_than", value: 0.2 }
        ],
        actions: [
            { type: "notify", target: "supervisor", value: "escalation" }
        ],
        score_impact: 15,
        is_active: true
    }
];

export function ComplianceRulesEngine() {
    const [rules, setRules] = useState<Rule[]>(mockRules);
    const [activeTab, setActiveTab] = useState("rules");
    const [isEditing, setIsEditing] = useState(false);
    const [editingRule, setEditingRule] = useState<Partial<Rule>>({
        type: "keyword",
        severity: "medium",
        conditions: [],
        actions: [],
        score_impact: 0,
        is_active: true
    });

    const handleAddCondition = () => {
        setEditingRule(prev => ({
            ...prev,
            conditions: [...(prev.conditions || []), { field: "", operator: "", value: "" }]
        }));
    };

    const handleRemoveCondition = (index: number) => {
        setEditingRule(prev => ({
            ...prev,
            conditions: prev.conditions?.filter((_, i) => i !== index)
        }));
    };

    const handleAddAction = () => {
        setEditingRule(prev => ({
            ...prev,
            actions: [...(prev.actions || []), { type: "", target: "", value: "" }]
        }));
    };

    const handleRemoveAction = (index: number) => {
        setEditingRule(prev => ({
            ...prev,
            actions: prev.actions?.filter((_, i) => i !== index)
        }));
    };

    const handleSaveRule = () => {
        if (editingRule.id) {
            // Update existing rule
            setRules(prev => prev.map(rule => 
                rule.id === editingRule.id ? { ...rule, ...editingRule } as Rule : rule
            ));
        } else {
            // Add new rule
            const newRule: Rule = {
                ...editingRule as Rule,
                id: Date.now().toString()
            };
            setRules(prev => [...prev, newRule]);
        }
        setIsEditing(false);
        setEditingRule({
            type: "keyword",
            severity: "medium",
            conditions: [],
            actions: [],
            score_impact: 0,
            is_active: true
        });
    };

    const handleEditRule = (rule: Rule) => {
        setEditingRule(rule);
        setIsEditing(true);
    };

    const handleDeleteRule = (id: string) => {
        setRules(prev => prev.filter(rule => rule.id !== id));
    };

    const getSeverityColor = (severity: Rule["severity"]) => {
        switch (severity) {
            case "low":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "high":
                return "bg-orange-500";
            case "critical":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getTypeIcon = (type: Rule["type"]) => {
        switch (type) {
            case "keyword":
                return <Settings className="w-4 h-4" />;
            case "sentiment":
                return <AlertTriangle className="w-4 h-4" />;
            case "duration":
                return <Clock className="w-4 h-4" />;
            case "topic":
                return <MessageSquare className="w-4 h-4" />;
            case "custom":
                return <Code className="w-4 h-4" />;
            default:
                return <Settings className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Compliance Rules Engine</CardTitle>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Rule
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs.Root defaultValue={activeTab} onValueChange={setActiveTab}>
                        <Tabs.List className="mb-4">
                            <Tabs.Trigger value="rules">Rules</Tabs.Trigger>
                            <Tabs.Trigger value="violations">Violations</Tabs.Trigger>
                            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                        </Tabs.List>
                        
                        <Tabs.Content value="rules">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Rule Name</label>
                                            <Input
                                                value={editingRule.name || ""}
                                                onChange={e => setEditingRule(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Enter rule name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Rule Type</label>
                                            <Select
                                                value={editingRule.type}
                                                onValueChange={value => setEditingRule(prev => ({ ...prev, type: value as Rule["type"] }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select rule type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="keyword">Keyword</SelectItem>
                                                    <SelectItem value="sentiment">Sentiment</SelectItem>
                                                    <SelectItem value="duration">Duration</SelectItem>
                                                    <SelectItem value="topic">Topic</SelectItem>
                                                    <SelectItem value="custom">Custom</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea
                                            value={editingRule.description || ""}
                                            onChange={e => setEditingRule(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter rule description"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Severity</label>
                                            <Select
                                                value={editingRule.severity}
                                                onValueChange={value => setEditingRule(prev => ({ ...prev, severity: value as Rule["severity"] }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select severity" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="critical">Critical</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Score Impact</label>
                                            <Input
                                                type="number"
                                                value={editingRule.score_impact || 0}
                                                onChange={e => setEditingRule(prev => ({ ...prev, score_impact: parseInt(e.target.value) }))}
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-medium">Conditions</label>
                                            <Button variant="outline" size="sm" onClick={handleAddCondition}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Condition
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {editingRule.conditions?.map((condition, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                                    <div className="col-span-4">
                                                        <Input
                                                            value={condition.field}
                                                            onChange={e => {
                                                                const updatedConditions = [...(editingRule.conditions || [])];
                                                                updatedConditions[index].field = e.target.value;
                                                                setEditingRule(prev => ({ ...prev, conditions: updatedConditions }));
                                                            }}
                                                            placeholder="Field"
                                                        />
                                                    </div>
                                                    <div className="col-span-3">
                                                        <Select
                                                            value={condition.operator}
                                                            onValueChange={value => {
                                                                const updatedConditions = [...(editingRule.conditions || [])];
                                                                updatedConditions[index].operator = value;
                                                                setEditingRule(prev => ({ ...prev, conditions: updatedConditions }));
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Operator" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="equals">Equals</SelectItem>
                                                                <SelectItem value="contains">Contains</SelectItem>
                                                                <SelectItem value="greater_than">Greater Than</SelectItem>
                                                                <SelectItem value="less_than">Less Than</SelectItem>
                                                                <SelectItem value="not_equals">Not Equals</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-4">
                                                        <Input
                                                            value={condition.value}
                                                            onChange={e => {
                                                                const updatedConditions = [...(editingRule.conditions || [])];
                                                                updatedConditions[index].value = e.target.value;
                                                                setEditingRule(prev => ({ ...prev, conditions: updatedConditions }));
                                                            }}
                                                            placeholder="Value"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => handleRemoveCondition(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-medium">Actions</label>
                                            <Button variant="outline" size="sm" onClick={handleAddAction}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Action
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {editingRule.actions?.map((action, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                                    <div className="col-span-4">
                                                        <Select
                                                            value={action.type}
                                                            onValueChange={value => {
                                                                const updatedActions = [...(editingRule.actions || [])];
                                                                updatedActions[index].type = value;
                                                                setEditingRule(prev => ({ ...prev, actions: updatedActions }));
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Action Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="notify">Notify</SelectItem>
                                                                <SelectItem value="flag">Flag</SelectItem>
                                                                <SelectItem value="escalate">Escalate</SelectItem>
                                                                <SelectItem value="block">Block</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-4">
                                                        <Select
                                                            value={action.target}
                                                            onValueChange={value => {
                                                                const updatedActions = [...(editingRule.actions || [])];
                                                                updatedActions[index].target = value;
                                                                setEditingRule(prev => ({ ...prev, actions: updatedActions }));
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Target" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="agent">Agent</SelectItem>
                                                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                                                <SelectItem value="compliance">Compliance Team</SelectItem>
                                                                <SelectItem value="system">System</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <Input
                                                            value={action.value}
                                                            onChange={e => {
                                                                const updatedActions = [...(editingRule.actions || [])];
                                                                updatedActions[index].value = e.target.value;
                                                                setEditingRule(prev => ({ ...prev, actions: updatedActions }));
                                                            }}
                                                            placeholder="Value"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => handleRemoveAction(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={editingRule.is_active}
                                            onCheckedChange={checked => setEditingRule(prev => ({ ...prev, is_active: checked }))}
                                        />
                                        <label className="text-sm font-medium">Active</label>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveRule}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Rule
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {rules.map(rule => (
                                        <Card key={rule.id}>
                                            <CardHeader>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2">
                                                        {getTypeIcon(rule.type)}
                                                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge className={getSeverityColor(rule.severity)}>
                                                            {rule.severity}
                                                        </Badge>
                                                        {rule.is_active ? (
                                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                                Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                                                Inactive
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-500 mb-4">{rule.description}</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium mb-2">Conditions</h4>
                                                        <div className="space-y-1">
                                                            {rule.conditions.map((condition, index) => (
                                                                <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                                                    <span className="font-medium">{condition.field}</span>{" "}
                                                                    <span className="text-gray-500">{condition.operator}</span>{" "}
                                                                    <span className="font-medium">{condition.value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 className="text-sm font-medium mb-2">Actions</h4>
                                                        <div className="space-y-1">
                                                            {rule.actions?.map((action, index) => (
                                                                <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                                                    <span className="font-medium">{action.type}</span>{" "}
                                                                    <span className="text-gray-500">to</span>{" "}
                                                                    <span className="font-medium">{action.target}</span>{" "}
                                                                    <span className="text-gray-500">with</span>{" "}
                                                                    <span className="font-medium">{action.value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 flex justify-between items-center">
                                                    <div className="text-sm">
                                                        <span className="text-gray-500">Score Impact:</span>{" "}
                                                        <span className="font-medium">{rule.score_impact} points</span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleEditRule(rule)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDeleteRule(rule.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Tabs.Content>
                        
                        <Tabs.Content value="violations">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Violations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center py-8">
                                            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                                            <p className="text-gray-500">No recent violations found</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Tabs.Content>
                        
                        <Tabs.Content value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Compliance Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Automatic Evaluation</p>
                                                <p className="text-sm text-gray-500">Evaluate calls against rules automatically</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Real-time Alerts</p>
                                                <p className="text-sm text-gray-500">Send alerts when violations are detected</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Escalation Threshold</p>
                                                <p className="text-sm text-gray-500">Automatically escalate after multiple violations</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        
                                        <div className="pt-4">
                                            <Button>Save Settings</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Tabs.Content>
                    </Tabs.Root>
                </CardContent>
            </Card>
        </div>
    );
} 