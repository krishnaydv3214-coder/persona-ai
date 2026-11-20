"use client";
import { useEffect, useState } from "react";
import PersonaSelector from "../components/PersonaSelector";
import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import {

  Card,

  CardContent,

  CardHeader,

  CardTitle,

} from "@/components/ui/card";
import { useChat } from "@/hooks/useChat";


export default function Home() {
 const [selectedPersona, setSelectedPersona] = useState("hitesh");

useEffect(() => {
  const savedPersona = window.localStorage.getItem("selectedPersona");

  if (savedPersona) {
    setSelectedPersona(savedPersona);
  }
}, []);

useEffect(() => {
  window.localStorage.setItem("selectedPersona", selectedPersona);
}, [selectedPersona]);
const {
  message,
  setMessage,
  messages,
  setMessages,
  loading,
  setLoading,
  error,
  setError,
} = useChat(selectedPersona);

const handleSend = async () => {
  if (message.trim() === "") return;

  if (!selectedPersona) {
    alert("Please select a persona.");
    return;
  }

  setLoading(true);
  setError("");

  const userMessage = {
    sender: "user" as const,
    text: message,
  };

  const updatedHistory = [
    ...messages,
    userMessage,
  ];

  setMessages((prev) => [
    ...prev,
    userMessage,
    {
      sender: "ai" as const,
      text: "",
    },
  ]);

  setMessage("");

  // try {
  //   const response = await fetch("/api/chat", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       persona: selectedPersona,
  //       history: updatedHistory,
  //     }),
  //   });

  //   if (!response.ok || !response.body) {
  //     throw new Error("Streaming failed");
  //   }

  //   const reader = response.body.getReader();

  //   const decoder = new TextDecoder();

  //   let fullText = "";

  //   while (true) {
  //     const { done, value } =
  //       await reader.read();

  //     if (done) break;

  //     fullText += decoder.decode(value, { stream: true });

  //     setMessages((prev) => {
  //       const updated = [...prev];

  //       updated[updated.length - 1] = {
  //         sender: "ai",
  //         text: fullText,
  //       };

  //       return updated;
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);

  //   setError(
  //     "⚠️ Failed to get a response. Please try again."
  //   );

  //   setMessages((prev) => prev.slice(0, -1));
  // } finally {
  //   setLoading(false);
  // }

try {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            persona: selectedPersona,
            history: updatedHistory,
        }),
    });

    if (!response.ok || !response.body) {
        throw new Error(`Streaming failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullText = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        fullText += decoder.decode(value, { stream: true });

        setMessages((prev) => {
            const updated = [...prev];

            updated[updated.length - 1] = {
                sender: "ai",
                text: fullText,
            };

            return updated;
        });
    }

    // Flush remaining decoded characters
    fullText += decoder.decode();

    // Update the final AI message
    setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
            sender: "ai",
            text: fullText,
        };

        return updated;
    });

    console.log("Final AI response:", fullText);

    if (!fullText.trim()) {
        throw new Error("Gemini returned an empty response");
    }

} catch (error) {
    console.error("Chat error:", error);

    setError(
        "⚠️ Failed to get a response. Please try again."
    );

    setMessages((prev) => prev.slice(0, -1));

} finally {
    setLoading(false);
}

};
useEffect(() => {
  localStorage.setItem("selectedPersona", selectedPersona);
}, [selectedPersona]);
  return (
   <main className="min-h-screen bg-gray-100 p-6">
  <Card className="mx-auto w-full max-w-7xl">
        <CardHeader>
       <CardTitle className="text-4xl font-bold text-center">
            🤖 Persona AI
          </CardTitle>
        </CardHeader>

     <CardContent className="space-y-8 p-8">
          {/* Persona Selector */}
         <PersonaSelector 
         selectedPersona={selectedPersona}

  setSelectedPersona={setSelectedPersona}
         />
         <hr className="my-6 border-gray-300" />
         <p className="text-sm text-gray-600">
  Selected Persona: {selectedPersona }
</p>

          {/* Chat Area */}
      <ChatBox 
  messages={messages}
  loading={loading}
/>

          {/* Input */}


      <ChatInput
  message={message}
  setMessage={setMessage}
  handleSend={handleSend}
  loading={loading}
/>

{error && (
  <p className="text-sm text-red-600">
    {error}
  </p>
)}
        </CardContent>
      </Card>
    </main>
  );
}