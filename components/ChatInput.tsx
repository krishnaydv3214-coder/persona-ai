import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
type ChatInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  loading: boolean;
};
export default function ChatInput({
  message,
  setMessage,
  handleSend,
  loading,
}: ChatInputProps) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
  const textarea = textareaRef.current;

  if (!textarea) return;

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}, [message]);

  return (
   <div className="flex items-end gap-2">
     <Textarea
  ref={textareaRef}
  className="min-h-[44px] max-h-60 resize-none overflow-y-auto"
  placeholder="Type your message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
/>
      <Button
  onClick={handleSend}
  disabled={loading}
>
  {loading ? "Thinking..." : "Send"}
</Button>
    </div>
  );
}