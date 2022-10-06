import fs from 'fs';

async function jsonParser(file) {
  const rawdata = fs.readFileSync(file);
  const data = await JSON.parse(rawdata);
  return data;
}

export default async function housePriceEarningsRatio() {
  const ratios = await jsonParser('./datasets/ratio_house_price_earnings_residence_based.json');

  const ratiosData = ratios.data;

  let tidyRatiosData = [];

  ratiosData.forEach((item) => {
    const Geography = item.Geography;

    Object.entries(item).forEach(itemKeyValArray => {
      if (!itemKeyValArray[0].match(new RegExp('^2[0-9]{3}$'))) {
        // geo columns get their own `entries(...)` with this approach, but aren't numeric data.
        return;
      }

      tidyRatiosData.push({
        Geography,
        Time: itemKeyValArray[0],
        Value: itemKeyValArray[1],
      });
    });
  });

  ratios.data = tidyRatiosData;
  let ratiosMetadata = {
    description:
      "This data provides an important indicator of housing affordability in the borough. It is calculated by dividing house price by average (median) earnings in the borough. The data only covers earnings of full time workers.",
    downloads: null,
    keywords: ["housing", "inequality"],
    methodologies: {
      href: "https://data.london.gov.uk/dataset/ratio-house-prices-earnings-borough",
      title: "Sources and notes",
    },
    related_datasets: null,
    title: "Ratio of House Prices to Earnings residence based",
    release_date: "2021",
    source: "ONS, DCLG, GLA",
    sampleSize: null,
    indicatorGroup: "housing affordability",
    datasetLink: "https://data.london.gov.uk/dataset/ratio-house-prices-earnings-borough",
  };

  return [ratios, ratiosMetadata];
}
