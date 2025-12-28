import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdsenseConfig {
  publisherId: string | null;
  loading: boolean;
  error: string | null;
}

export function useAdsenseConfig() {
  const [config, setConfig] = useState<AdsenseConfig>({
    publisherId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase.functions.invoke("get-adsense-config");

        if (error) {
          setConfig({ publisherId: null, loading: false, error: "Erro ao carregar AdSense" });
          return;
        }

        if (data?.publisherId) {
          setConfig({ publisherId: data.publisherId, loading: false, error: null });
        } else {
          setConfig({ publisherId: null, loading: false, error: null });
        }
      } catch (err) {
        console.error("AdSense config error:", err);
        setConfig({ publisherId: null, loading: false, error: "Erro de conexão" });
      }
    }

    fetchConfig();
  }, []);

  return config;
}
