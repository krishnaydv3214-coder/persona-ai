import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

type CodeBlockProps = {
  className?: string;
  children: React.ReactNode;
};

export default function CodeRenderer({
  className,
  children,
}: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);

const code = String(children).replace(/\n$/, "");

const handleCopy = async () => {
  await navigator.clipboard.writeText(code);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};

  if (!match) {
    return (
      <code className={className}>
        {children}
      </code>
    );
  }

  return (
  <div className="relative">

   <Button
  size="icon"
  variant="secondary"
  className="absolute right-2 top-2 z-10"
  onClick={handleCopy}
>
  {copied ? (
    <Check className="h-4 w-4" />
  ) : (
    <Copy className="h-4 w-4" />
  )}
</Button>

    <SyntaxHighlighter
      style={oneDark}
      language={match[1]}
      PreTag="div"
      showLineNumbers
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>

  </div>
);
}