import dataVisualiser from "../../utils/dataVisualiser";

// Datawrapper-proxy needed as datawrapper only allows for serverside rendering of charts
// We can get arround this ssr by using a proxy api route, thus allowing us to client side render and move swiftly between pages
export default async function handler(req, res) {
  const { csv, indicator, location, chartType, minValue, maxValue } = JSON.parse(req.body);

  const chartIdAndUrl = await dataVisualiser(csv, indicator, location, chartType, minValue, maxValue);

  if (chartIdAndUrl === undefined) {
    res.status(500).json({ error: 'DataWrapper calls failed'});
  }

  res.status(200).json(chartIdAndUrl);
}
