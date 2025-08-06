import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react'; // Cool chat icon

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleResponse = (question: string) => {
    const lower = question.toLowerCase();

    const ictData = {
      departments: {
        "Computer Science": ["DPMCF0", "DPMC20", "ADMC20", "DPRSF0", "DPRS20", "ADRS20"],
        "Computer Systems Engineering": ["DPYEF0", "DPYE20", "ADYE20"],
        "Informatics": ["DPIFF0", "DPIF20", "ADIF20"],
        "Information Technology": ["DPITF0", "DPIT20", "ADIT21"],
      },
      exclusions: {
        academic: [
          "Refer to the ITS notification.",
          "Apply for an appeal against exclusion via EC (Electronic Campus).",
          "You will receive the outcome via SASO electronically.",
          "Sign the outcome letter via SASO online.",
          "If block was lifted: read conditions and register in cooperation with your Academic Department.",
          "If not lifted: You are excluded for 1 year from ICT Faculty.",
          "No reconsideration at Academic Department or SASO after rejection.",
        ],
        financial: [
          "Refer to the ITS notification.",
          "Visit Mr Rodney Lebelo at Student Accounts (building 12, ground floor)."
        ]
      },
      nsfas: [
        "Visit the Financial Aid Office.",
        "Get a propensity letter form and have it signed by your Academic Department and OneStop.",
        "For other issues, visit the NSFAS website."
      ],
      courseChange: [
        "Must have been registered the previous academic year.",
        "Apply via EC during October/November only.",
        "After approval, cancel current course before registering new one.",
        "Visit Academic Department for credit evaluations."
      ],
      exams: {
        specialExit: "Visit the Examination Administration office.",
        probation: ["Refer to the ITS notification.", "Sign probation form via SASO electronically."]
      },
      timetables: "Visit your Academic Department. If there are clashes, visit urgently.",
      readmissions: [
        "Break in studies: Get form from OneStop building 7, get Academic Department approval.",
        "Returning after exclusion: Same process via OneStop building 7 + Academic Department."
      ],
      intercampusTransfer: [
        "Registered Computer Science student: Apply via EC during late Oct to mid-Nov.",
        "Outcome sent via email."
      ],
      admissions: [
        "Visit www.tut.ac.za for application closing dates.",
        "After applying: check status, upload documents, request campus transfer via:",
        "Email: admission@tut.ac.za",
        "Phone: 0861102421",
        "Visit OneStop building 7 or Admissions Lab in building 10"
      ],
      newcomers: [
        "NO humanities queries at ICT offices.",
        "NO walk-ins to screen grade 12. Apply online.",
        "Visit www.tut.ac.za daily for late applications."
      ],
      bursaries: "Visit FUNDI office, building 12, ground floor.",
      residence: "Contact Solly Sekgalabje (012 382 9500) or sekgalabjesb@tut.ac.za",
      cat: "Get CAT form from OneStop building 7. Approval needed from your Academic Department."
    };

    let response = "Sorry, I couldn't find info for that. Try asking about exclusions, departments, NSFAS, etc.";

    if (lower.includes("department")) {
      response = Object.entries(ictData.departments)
        .map(([dept, codes]) => `${dept}: ${codes.join(", ")}`)
        .join("\n");
    } else if (lower.includes("academic exclusion")) {
      response = ictData.exclusions.academic.join("\n");
    } else if (lower.includes("financial exclusion")) {
      response = ictData.exclusions.financial.join("\n");
    }
     else if (lower.includes("exclusion")) {
      response = ictData.exclusions.financial.join("\n");
    } else if (lower.includes("nsfas")) {
      response = ictData.nsfas.join("\n");
    } else if (lower.includes("change of course")) {
      response = ictData.courseChange.join("\n");
    }else if (lower.includes("course")) {
      response = ictData.courseChange.join("\n");
    } else if (lower.includes("special exam") || lower.includes("exit exam")) {
      response = ictData.exams.specialExit;
    } else if (lower.includes("probation")) {
      response = ictData.exams.probation.join("\n");
    } else if (lower.includes("timetable")) {
      response = ictData.timetables;
    } else if (lower.includes("readmission")) {
      response = ictData.readmissions.join("\n");
    } else if (lower.includes("intercampus")) {
      response = ictData.intercampusTransfer.join("\n");
    } else if (lower.includes("admission")) {
      response = ictData.admissions.join("\n");
    } else if (lower.includes("newcomer") || lower.includes("walk-in")) {
      response = ictData.newcomers.join("\n");
    } else if (lower.includes("bursary")) {
      response = ictData.bursaries;
    } else if (lower.includes("residence")) {
      response = ictData.residence;
    } else if (lower.includes("cat") || lower.includes("credit")) {
      response = ictData.cat;
    }

    return response;
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, `You: ${message}`]);
    setInput('');
    setIsTyping(true);

    const response = handleResponse(message);
    const delay = Math.min(3000, Math.max(1000, response.length * 10));
    await new Promise(res => setTimeout(res, delay));

    setIsTyping(false);
    setMessages(prev => [...prev, `Bot: ${response}`]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle button */}
      <button
        onClick={toggleChatbot}
        className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition duration-300" style={{border: "2px solid white"}}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat container */}
      {isOpen && (
        <div className="bg-white shadow-2xl rounded-xl p-4 mt-3 w-80 max-h-[36rem] flex flex-col animate-fade-in border border-gray-200">
          <div className="font-bold text-lg mb-2 text-blue-700">ICT Faculty Assistant</div>
          <div className="flex-1 overflow-y-auto border rounded-lg p-3 space-y-2 text-sm bg-gray-50 mb-2 h-64">
            {messages.map((msg, i) => (
              <div key={i} className={msg.startsWith('Bot:') ? 'text-gray-700' : 'text-right text-blue-600'}>
                {msg}
              </div>
            ))}
            {isTyping && <div className="italic text-gray-400">Typing...</div>}
          </div>
          <input
            type="text"
            value={input}
            placeholder="Ask me something..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage(input);
            }}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
