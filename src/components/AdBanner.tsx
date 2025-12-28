import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdBanner({ adSlot, adFormat = "auto", className = "" }: AdBannerProps) {
  const [publisherId, setPublisherId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchPublisherId() {
      try {
        const { data } = await supabase.functions.invoke("get-adsense-config");
        if (data?.publisherId) {
          setPublisherId(data.publisherId);
        }
      } catch (err) {
        console.error("Failed to load AdSense config:", err);
      }
    }

    fetchPublisherId();
  }, []);

  useEffect(() => {
    if (!publisherId || loaded) return;

    // Load AdSense script
    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    script.onload = () => {
      setLoaded(true);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    };

    return () => {
      // Cleanup if needed
    };
  }, [publisherId, loaded]);

  if (!publisherId) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
