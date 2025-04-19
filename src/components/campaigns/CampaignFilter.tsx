import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CampaignFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  status: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Draft", value: "draft" },
  { label: "Completed", value: "completed" },
  { label: "Paused", value: "paused" }
];

export function CampaignFilter({ onFilterChange }: CampaignFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    dateRange: {
      from: null,
      to: null
    }
  });

  const toggleStatus = (status: string) => {
    setFilters(prev => {
      const newStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      
      const newFilters = {
        ...prev,
        status: newStatus
      };
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleDateRangeChange = (field: 'from' | 'to', date: Date | null) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [field]: date
        }
      };
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const newFilters = {
      status: [],
      dateRange: {
        from: null,
        to: null
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = filters.status.length + 
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Campaigns</SheetTitle>
        </SheetHeader>
        
        <div className="py-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.status.includes(option.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStatus(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="text-sm font-medium mb-3">Date Range</h4>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label>From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? (
                          format(filters.dateRange.from, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => handleDateRangeChange('from', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label>To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !filters.dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? (
                          format(filters.dateRange.to, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => handleDateRangeChange('to', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 