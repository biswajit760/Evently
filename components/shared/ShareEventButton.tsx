"use client";

import { useState } from "react";
import { Share2, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ShareEventButton({
  eventId,
  title,
}: {
  eventId: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const shareUrl = `${baseUrl}/events/${eventId}`;

  const handleShare = async () => {
    // 📱 Mobile Native Share
    if (navigator.share) {
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

    // 💻 Desktop Clipboard Copy
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="group w-full flex items-center justify-between rounded-xl 
      bg-white dark:bg-zinc-900 
      border border-gray-100 dark:border-zinc-800 
      px-4 py-3 shadow-sm hover:shadow-md transition-all 
      hover:border-indigo-200 dark:hover:border-zinc-700"
    >
      <div className="flex items-center gap-3">
        {/* Icon Box */}
        <div className={`p-2 rounded-lg transition-colors ${
          copied 
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        }`}>
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </div>
        
        {/* Text */}
        <span className="font-semibold text-gray-800 dark:text-white">
          {copied ? "Link Copied!" : "Share Event"}
        </span>
      </div>

      {/* Arrow / Status Indicator */}
      <ArrowRight className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${
        !copied && "group-hover:translate-x-1"
      }`} />
    </button>
  );
}