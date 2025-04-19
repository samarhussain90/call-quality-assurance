import React, { useState, useEffect } from "react";
import { 
  ConditionalRule, 
  NotificationEvent, 
  ConditionOperator, 
  DataFieldType,
  DataField
} from "@/types/communication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data fields for different events
const MOCK_DATA_FIELDS: Record<NotificationEvent, DataField[]> = {
  call_started: [
    { id: "call_id", name: "Call ID", type: "text", description: "Unique identifier for the call", event: "call_started" },
    { id: "agent_id", name: "Agent ID", type: "text", description: "ID of the agent handling the call", event: "call_started" },
    { id: "customer_id", name: "Customer ID", type: "text", description: "ID of the customer", event: "call_started" },
    { id: "timestamp", name: "Timestamp", type: "date", description: "When the call started", event: "call_started" },
  ],
  call_ended: [
    { id: "call_id", name: "Call ID", type: "text", description: "Unique identifier for the call", event: "call_ended" },
    { id: "duration", name: "Duration", type: "number", description: "Call duration in seconds", event: "call_ended" },
    { id: "disposition", name: "Disposition", type: "text", description: "Final call disposition", event: "call_ended" },
    { id: "quality_score", name: "Quality Score", type: "number", description: "Call quality score (0-100)", event: "call_ended" },
  ],
  compliance_violation: [
    { id: "call_id", name: "Call ID", type: "text", description: "Unique identifier for the call", event: "compliance_violation" },
    { id: "violation_type", name: "Violation Type", type: "text", description: "Type of compliance violation", event: "compliance_violation" },
    { id: "severity", name: "Severity", type: "text", description: "Severity level of the violation", event: "compliance_violation" },
    { id: "transcript_segment", name: "Transcript Segment", type: "text", description: "Relevant part of the transcript", event: "compliance_violation" },
  ],
  quality_score_low: [
    { id: "call_id", name: "Call ID", type: "text", description: "Unique identifier for the call", event: "quality_score_low" },
    { id: "quality_score", name: "Quality Score", type: "number", description: "Call quality score (0-100)", event: "quality_score_low" },
    { id: "threshold", name: "Threshold", type: "number", description: "Quality score threshold", event: "quality_score_low" },
    { id: "agent_id", name: "Agent ID", type: "text", description: "ID of the agent handling the call", event: "quality_score_low" },
  ],
  agent_offline: [
    { id: "agent_id", name: "Agent ID", type: "text", description: "ID of the agent", event: "agent_offline" },
    { id: "timestamp", name: "Timestamp", type: "date", description: "When the agent went offline", event: "agent_offline" },
    { id: "reason", name: "Reason", type: "text", description: "Reason for going offline", event: "agent_offline" },
  ],
  agent_online: [
    { id: "agent_id", name: "Agent ID", type: "text", description: "ID of the agent", event: "agent_online" },
    { id: "timestamp", name: "Timestamp", type: "date", description: "When the agent came online", event: "agent_online" },
    { id: "device", name: "Device", type: "text", description: "Device used to log in", event: "agent_online" },
  ],
  campaign_completed: [
    { id: "campaign_id", name: "Campaign ID", type: "text", description: "ID of the completed campaign", event: "campaign_completed" },
    { id: "total_calls", name: "Total Calls", type: "number", description: "Total number of calls made", event: "campaign_completed" },
    { id: "success_rate", name: "Success Rate", type: "number", description: "Campaign success rate", event: "campaign_completed" },
    { id: "duration", name: "Duration", type: "number", description: "Campaign duration in days", event: "campaign_completed" },
  ],
  custom: [
    { id: "event_id", name: "Event ID", type: "text", description: "ID of the custom event", event: "custom" },
    { id: "event_type", name: "Event Type", type: "text", description: "Type of custom event", event: "custom" },
    { id: "data", name: "Event Data", type: "text", description: "Custom event data", event: "custom" },
    { id: "timestamp", name: "Timestamp", type: "date", description: "When the event occurred", event: "custom" },
  ],
};

// Available operators based on field type
const OPERATORS_BY_TYPE: Record<DataFieldType, ConditionOperator[]> = {
  text: ["equals", "not_equals", "contains", "not_contains", "starts_with", "ends_with"],
  number: ["equals", "not_equals", "greater_than", "less_than"],
  boolean: ["equals", "not_equals"],
  date: ["equals", "not_equals", "greater_than", "less_than"],
  array: ["contains", "not_contains"],
};

interface ConditionalRulesProps {
  events: NotificationEvent[];
  rules: ConditionalRule[];
  onChange: (rules: ConditionalRule[]) => void;
}

export function ConditionalRules({ events, rules, onChange }: ConditionalRulesProps) {
  const [availableFields, setAvailableFields] = useState<DataField[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NotificationEvent | "">("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedOperator, setSelectedOperator] = useState<ConditionOperator | "">("");
  const [inputValue, setInputValue] = useState<string>("");
  const [booleanValue, setBooleanValue] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<DataFieldType>("text");

  // Update available fields when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setAvailableFields(MOCK_DATA_FIELDS[selectedEvent] || []);
    } else {
      setAvailableFields([]);
    }
    setSelectedField("");
    setSelectedOperator("");
    setInputValue("");
    setFieldType("text");
  }, [selectedEvent]);

  // Update field type when selected field changes
  useEffect(() => {
    if (selectedField) {
      const field = availableFields.find(f => f.id === selectedField);
      if (field) {
        setFieldType(field.type);
      }
    }
  }, [selectedField, availableFields]);

  const handleAddRule = () => {
    if (!selectedEvent || !selectedField || !selectedOperator) return;

    const newRule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      event: selectedEvent,
      field: selectedField,
      operator: selectedOperator as ConditionOperator,
      value: fieldType === "boolean" ? booleanValue : inputValue
    };

    onChange([...rules, newRule]);
    
    // Reset form
    setSelectedEvent("");
    setSelectedField("");
    setSelectedOperator("");
    setInputValue("");
    setBooleanValue(false);
    setFieldType("text");
  };

  const handleRemoveRule = (ruleId: string) => {
    onChange(rules.filter(rule => rule.id !== ruleId));
  };

  const getOperatorLabel = (operator: ConditionOperator): string => {
    switch (operator) {
      case "equals": return "Equals";
      case "not_equals": return "Not Equals";
      case "contains": return "Contains";
      case "not_contains": return "Not Contains";
      case "greater_than": return "Greater Than";
      case "less_than": return "Less Than";
      case "starts_with": return "Starts With";
      case "ends_with": return "Ends With";
      default: return operator;
    }
  };

  const getFieldLabel = (fieldId: string): string => {
    const field = availableFields.find(f => f.id === fieldId);
    return field ? field.name : fieldId;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Conditional Rules</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add conditions to filter when notifications are sent</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {rules.length > 0 ? (
        <div className="space-y-2">
          {rules.map(rule => (
            <Card key={rule.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {EVENT_OPTIONS.find(e => e.value === rule.event)?.label || rule.event}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getFieldLabel(rule.field)} {getOperatorLabel(rule.operator as ConditionOperator)} {rule.value.toString()}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4 border-dashed">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No conditional rules added. Notifications will be sent for all selected events.
            </p>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add New Rule</CardTitle>
          <CardDescription>
            Create a condition to filter when notifications are sent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event">Event</Label>
              <Select
                value={selectedEvent}
                onValueChange={(value) => setSelectedEvent(value as NotificationEvent)}
              >
                <SelectTrigger id="event">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map(event => (
                    <SelectItem key={event} value={event}>
                      {EVENT_OPTIONS.find(e => e.value === event)?.label || event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Field</Label>
              <Select
                value={selectedField}
                onValueChange={setSelectedField}
                disabled={!selectedEvent}
              >
                <SelectTrigger id="field">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator">Operator</Label>
              <Select
                value={selectedOperator}
                onValueChange={(value) => setSelectedOperator(value as ConditionOperator)}
                disabled={!selectedField}
              >
                <SelectTrigger id="operator">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS_BY_TYPE[fieldType]?.map(operator => (
                    <SelectItem key={operator} value={operator}>
                      {getOperatorLabel(operator)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              {fieldType === "boolean" ? (
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="value"
                    checked={booleanValue}
                    onCheckedChange={setBooleanValue}
                  />
                  <Label htmlFor="value">True</Label>
                </div>
              ) : (
                <Input
                  id="value"
                  placeholder="Enter value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type={fieldType === "number" ? "number" : "text"}
                  disabled={!selectedOperator}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAddRule}
              disabled={!selectedEvent || !selectedField || !selectedOperator || 
                (fieldType !== "boolean" && !inputValue)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper constant for event options
const EVENT_OPTIONS: { value: NotificationEvent; label: string }[] = [
  { value: "call_started", label: "Call Started" },
  { value: "call_ended", label: "Call Ended" },
  { value: "compliance_violation", label: "Compliance Violation" },
  { value: "quality_score_low", label: "Quality Score Low" },
  { value: "agent_offline", label: "Agent Offline" },
  { value: "agent_online", label: "Agent Online" },
  { value: "campaign_completed", label: "Campaign Completed" },
  { value: "custom", label: "Custom Event" }
]; 