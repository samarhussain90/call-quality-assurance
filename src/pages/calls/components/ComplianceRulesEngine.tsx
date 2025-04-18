import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Settings,
  Save
} from "lucide-react";

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type: "keyword" | "phrase" | "pattern" | "sentiment";
  pattern: string;
  severity: "warning" | "critical";
  action: "flag" | "alert" | "block";
  enabled: boolean;
}

interface ComplianceRulesEngineProps {
  onRuleChange?: (rules: ComplianceRule[]) => void;
}

export function ComplianceRulesEngine({ onRuleChange }: ComplianceRulesEngineProps) {
  const [rules, setRules] = useState<ComplianceRule[]>([
    {
      id: "1",
      name: "No Personal Information",
      description: "Flag when agents share or request personal information",
      type: "pattern",
      pattern: "(?i)(ssn|social security|credit card|password|account number)",
      severity: "critical",
      action: "flag",
      enabled: true
    },
    {
      id: "2",
      name: "Negative Sentiment",
      description: "Alert when customer sentiment becomes negative",
      type: "sentiment",
      pattern: "negative",
      severity: "warning",
      action: "alert",
      enabled: true
    },
    {
      id: "3",
      name: "Required Disclaimers",
      description: "Ensure required legal disclaimers are mentioned",
      type: "phrase",
      pattern: "this call may be recorded for quality purposes",
      severity: "warning",
      action: "flag",
      enabled: true
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<ComplianceRule>>({
    name: "",
    description: "",
    type: "keyword",
    pattern: "",
    severity: "warning",
    action: "flag",
    enabled: true
  });

  const [isAddingRule, setIsAddingRule] = useState(false);

  const handleAddRule = () => {
    if (newRule.name && newRule.pattern) {
      const rule: ComplianceRule = {
        id: Date.now().toString(),
        name: newRule.name,
        description: newRule.description || "",
        type: newRule.type || "keyword",
        pattern: newRule.pattern,
        severity: newRule.severity || "warning",
        action: newRule.action || "flag",
        enabled: true
      };

      setRules([...rules, rule]);
      setNewRule({
        name: "",
        description: "",
        type: "keyword",
        pattern: "",
        severity: "warning",
        action: "flag",
        enabled: true
      });
      setIsAddingRule(false);
      onRuleChange?.(rules);
    }
  };

  const handleDeleteRule = (id: string) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    onRuleChange?.(updatedRules);
  };

  const handleToggleRule = (id: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    );
    setRules(updatedRules);
    onRuleChange?.(updatedRules);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "flag":
        return <AlertTriangle className="h-4 w-4" />;
      case "alert":
        return <Settings className="h-4 w-4" />;
      case "block":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Compliance Rules Engine</h2>
        <Button 
          variant="outline" 
          onClick={() => setIsAddingRule(!isAddingRule)}
          className="text-white border-gray-700 hover:bg-gray-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {isAddingRule && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">New Compliance Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Rule Name</label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter rule name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Rule Type</label>
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as ComplianceRule["type"] })}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                >
                  <option value="keyword">Keyword</option>
                  <option value="phrase">Phrase</option>
                  <option value="pattern">Pattern</option>
                  <option value="sentiment">Sentiment</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Description</label>
              <Textarea
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter rule description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Pattern</label>
                <Input
                  value={newRule.pattern}
                  onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter pattern or keyword"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Severity</label>
                <select
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as ComplianceRule["severity"] })}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                >
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Action</label>
              <select
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value as ComplianceRule["action"] })}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              >
                <option value="flag">Flag</option>
                <option value="alert">Alert</option>
                <option value="block">Block</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingRule(false)}
                className="text-white border-gray-700 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddRule}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-white">{rule.name}</h3>
                    <Badge 
                      variant={rule.enabled ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{rule.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Type:</span>
                      <Badge variant="outline" className="text-xs">
                        {rule.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Severity:</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSeverityColor(rule.severity)}`}
                      >
                        {rule.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Action:</span>
                      <Badge variant="outline" className="text-xs">
                        {rule.action}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleRule(rule.id)}
                    className="text-white hover:bg-gray-700"
                  >
                    {rule.enabled ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-white hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 