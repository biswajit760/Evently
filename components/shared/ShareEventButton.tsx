"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

export default function ShareEventButton({
  eventId,
  
  title,
}: {
  eventId: string;
  title: string;
}) {
  
  const [copied, setCopied] = useState(false);
  console.log(eventId)

  // ✅ Build share URL safely using env variable
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const shareUrl = `${baseUrl}/events/${eventId}`;


  const handleShare = async () => {
    // 📱 If the device supports native sharing (mobile)
    if (navigator.share) {
        console.log(eventId)
      try {
        await navigator.share({
          title,
          text: `Check out this event: ${title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
      return;
    }

    // 💻 Desktop fallback → Copy to clipboard
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);

    toast.success("Link Copied");

    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="flex items-center gap-2 cursor-pointer"
    >
      {/* Dynamic Icon Swapping */}
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      
      {/* Dynamic Text */}
      {copied ? "Copied" : "Share"}
    </Button>
  );
}
