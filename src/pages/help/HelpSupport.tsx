import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I create a new campaign?",
      answer: "To create a new campaign, navigate to the Campaigns section and click the 'Create Campaign' button. Fill in the required details such as campaign name, target audience, and call script. You can then schedule the campaign or start it immediately.",
      category: "Campaigns",
    },
    {
      id: "2",
      question: "How do I interpret analytics data?",
      answer: "The Analytics dashboard provides various metrics including call success rates, conversion rates, and agent performance. Each metric is color-coded and includes trend indicators. Hover over any metric for detailed information and click to view the full report.",
      category: "Analytics",
    },
    {
      id: "3",
      question: "What are compliance rules?",
      answer: "Compliance rules ensure your calls adhere to regulatory requirements. You can set up rules for script adherence, required disclosures, and prohibited language. The system will automatically flag calls that violate these rules for review.",
      category: "Compliance",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Help & Support</h1>
          <p className="text-gray-400">Find answers to common questions and get support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gray-800 border-gray-700">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-cyan-500" />
              <div>
                <h3 className="font-medium text-white">Email Support</h3>
                <p className="text-sm text-gray-400">support@example.com</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gray-800 border-gray-700">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-cyan-500" />
              <div>
                <h3 className="font-medium text-white">Phone Support</h3>
                <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gray-800 border-gray-700">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-cyan-500" />
              <div>
                <h3 className="font-medium text-white">Live Chat</h3>
                <p className="text-sm text-gray-400">Available 24/7</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="flex-1 bg-gray-800 border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-32rem)]">
            <div className="p-4 space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-4 flex items-center justify-between bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-cyan-500">{faq.category}</span>
                      <h3 className="font-medium text-white">{faq.question}</h3>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="p-4 bg-gray-800">
                      <p className="text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <div className="mt-6">
          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
} 