import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeRenderer from "./CodeRenderer";
type ChatBoxProps = {
  messages: Message[];
  loading: boolean;
};
export default function ChatBox({ 
  messages,
  loading
}: ChatBoxProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  chatContainerRef.current?.scrollTo({
    top: chatContainerRef.current.scrollHeight,
    behavior: "smooth",
  });
}, [messages, loading]);
  return (
    <div
  ref={chatContainerRef}
className="h-[65vh] border rounded-lg p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-gray-500">
          Chat messages will appear here...
        </p>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-6 flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            
            <div
              className={`max-w-[80%] rounded-xl p-4 shadow ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              <strong className="block mb-2">
                {msg.sender === "user" ? "You" : "AI"}
              </strong>

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                 code({ children, className }) {
  return (
   <CodeRenderer className={className}>
  {children}
</CodeRenderer>
  );
},
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))
      )}
    </div>
  );
}