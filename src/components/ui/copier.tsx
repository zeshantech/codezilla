import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function Copier({ text, className }: { text: string; className?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Button variant="outline" onClick={handleCopy} className={className} size="icon-sm">
      {isCopied ? <Check className={cn("size-4 text-success")} /> : <Copy className={cn("size-4")} />}
    </Button>
  );
}
