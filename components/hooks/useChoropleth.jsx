import { useState, useEffect } from "react";

function buildCsv(dataset, indicator) {
  let csv = `Location,${indicator}\n`;
  if (dataset !== null) {
    dataset.forEach((datum) => {
      csv += `${datum["Geography"]},${datum["Value"]}\n`;
    });
  }

  return csv;
}

export default function useDatawrapper() {
  const [chartUrl, setChartUrl] = useState(null);
  const [loading, setLoading] = useState(null);
  const [datasetAndIndicator, setDatasetAndIndicator] = useState({
    dataset: null, // Array of objects. We'll convert with `buildCsv()` prior to calling out to Datawrapper.
    indicator: null,
  });

  // Send the datawrapper-proxy the details needed to send to datawrapper
  useEffect(() => {
    if (!datasetAndIndicator.indicator) {
      return
    }

    setLoading(true);
    fetch("/api/datawrapper-proxy", {
      method: "POST",
      body: JSON.stringify({
        csv: buildCsv(datasetAndIndicator.dataset, datasetAndIndicator.indicator),
        indicator: datasetAndIndicator.indicator,
        location: null,
        chartType: "d3-maps-choropleth",
      }),
    })
      .then((resolve) => resolve.json())
      .then((resolve) => {
        setChartUrl(resolve.chartUrl);
        setLoading(false);
      });
  }, [datasetAndIndicator]);

  return [chartUrl, loading, setDatasetAndIndicator];
}
