import { useState, useEffect } from "react";

export default function useDatawrapper(csv, indicator, location, chartType) {
  const [chartUrl, setChartUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sends the details to datawrapper-proxy to then send to datawrapper
  useEffect(() => {
    if (!csv || !indicator) {
      return
    }

    setLoading(true);
    fetch("/api/datawrapper-proxy", {
      method: "POST",
      body: JSON.stringify({
        csv,
        indicator,
        location,
        chartType,
      }),
    })
      .then((resolve) => resolve.json())
      .then((resolve) => {
        setChartUrl(resolve.chartUrl);
        setLoading(false);
      });
  }, [csv, indicator, location, chartType]);

  return [chartUrl, loading];
}
