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

/**
 * @param {string} dataset  Array of objects with `Value` keys.
 * @returns { min: number, max: number }  Each rounded to 3 significant figures.
 */
function getRoundedMinMax(dataset) {
  let minValue = undefined;
  let maxValue = undefined;

  dataset.forEach((datum) => {
    if (!datum.Value) {
      return; // Some data has blank string vals?
    }

    if (minValue === undefined || datum.Value < minValue) {
      minValue = parseFloat(datum.Value);
    }

    if (maxValue === undefined || datum.Value > maxValue) {
      maxValue = parseFloat(datum.Value);
    }
  });

  return {
    min: parseFloat(minValue.toPrecision(3)),
    max: parseFloat(maxValue.toPrecision(3)),
  };
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

    const minMax = getRoundedMinMax(datasetAndIndicator.dataset);

    setLoading(true);
    fetch("/api/datawrapper-proxy", {
      method: "POST",
      body: JSON.stringify({
        csv: buildCsv(datasetAndIndicator.dataset, datasetAndIndicator.indicator),
        indicator: datasetAndIndicator.indicator,
        location: null,
        chartType: "d3-maps-choropleth",
        minValue: minMax.min,
        maxValue: minMax.max,
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
