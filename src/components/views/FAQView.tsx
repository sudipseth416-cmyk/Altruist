"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, ChevronDown, Info, Shield, Users, FileText, 
  Lock, Clock, CheckCircle2, Smartphone, HelpCircle,
  Image as ImageIcon
} from "lucide-react";

const FAQ_DATA = [
  {
    id: 1,
    question: "What is this platform?",
    answer: "This platform helps users report and track community issues like waste management, enabling NGOs and authorities to take timely action.",
    icon: Info,
  },
  {
    id: 2,
    question: "Who can use this system?",
    answer: "Anyone including citizens, volunteers, and NGO members can access and use the platform.",
    icon: Users,
  },
  {
    id: 3,
    question: "How do I report a waste issue?",
    answer: "Navigate to the dashboard or reporting section, fill in the details, and optionally upload an image.",
    icon: FileText,
  },
  {
    id: 4,
    question: "Can I upload images with my complaint?",
    answer: "Yes, users can upload images to provide better context for the issue.",
    icon: ImageIcon,
  },
  {
    id: 5,
    question: "Is registration required?",
    answer: "Basic features may be accessible without login, but tracking and updates require registration.",
    icon: CheckCircle2,
  },
  {
    id: 6,
    question: "Is my personal data safe?",
    answer: "Yes, user data is securely handled and not shared without consent.",
    icon: Lock,
  },
  {
    id: 7,
    question: "Can I report anonymously?",
    answer: "Yes, the platform allows anonymous reporting to protect user identity.",
    icon: Shield,
  },
  {
    id: 8,
    question: "How long does it take for action?",
    answer: "Response time depends on the severity and location, but issues are monitored in real-time.",
    icon: Clock,
  },
  {
    id: 9,
    question: "What happens after I submit a complaint?",
    answer: "Your report is logged, analyzed, and forwarded to the relevant authority or NGO for action.",
    icon: HelpCircle,
  },
  {
    id: 10,
    question: "Does this work on mobile devices?",
    answer: "Yes, the platform is fully responsive and works across devices.",
    icon: Smartphone,
  },
];

export default function FAQView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(1); // ID 1 open by default

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return FAQ_DATA.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 sm:p-10 animate-fade-in max-w-4xl mx-auto w-full mb-10 relative overflow-hidden font-['Poppins',sans-serif]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      {/* Header Section */}
      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,214,242,0.2)]">
          <HelpCircle className="w-10 h-10 text-cyan-400" />
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4 text-shadow-glow">Frequently Asked Questions</h2>
        <p className="text-base text-white/60 font-medium max-w-xl mx-auto leading-relaxed">
          Find answers to common questions about using the platform, reporting field operations, and tracking intelligence.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10 max-w-2xl mx-auto group z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="relative flex items-center bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="pl-6 pr-2">
            <Search className="w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none py-4 pr-6 text-white font-medium placeholder-white/30 focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4 relative z-10 max-w-3xl mx-auto">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`
                  rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isOpen 
                    ? "bg-black/40 border-cyan-500/30 shadow-[0_5px_20px_rgba(6,214,242,0.15)]" 
                    : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
                  }
                `}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none group"
                >
                  <div className="flex items-center gap-5 pr-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border ${isOpen ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,214,242,0.2)]' : 'bg-white/5 text-white/40 border-white/10 group-hover:bg-white/10'}`}>
                      <faq.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-base sm:text-lg font-bold tracking-wide transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${isOpen ? 'bg-white/10 border-white/20 rotate-180' : 'bg-transparent border-transparent'}`}>
                    <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`} />
                  </div>
                </button>
                
                <div 
                  className={`
                    grid transition-all duration-300 ease-in-out
                    ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                  `}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 pt-0 pl-[84px] sm:pl-[88px]">
                      <p className="text-sm font-medium leading-relaxed text-white/60">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-black/20 border border-white/5 rounded-3xl">
            <Search className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h3 className="text-white font-bold tracking-wide mb-2 text-lg">No matching results</h3>
            <p className="text-sm text-white/50">We couldn't find anything matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
