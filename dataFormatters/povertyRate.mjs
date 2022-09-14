import fs from 'fs';

async function jsonParser(file) {
  const rawdata = fs.readFileSync(file);
  const data = await JSON.parse(rawdata);
  return data;
}

export default async function povertyRate(path, property) {
  const poverty = await jsonParser(path);

  poverty.data.forEach((item) => {
    item.Time = '2014-01';
    item.Value = item[property];
  });

  const metadata = {
    description: 'The most recent estimates of overall poverty rates for London boroughs are from modelled small-area estimates using 2013/14 data. These borough-level poverty rates are based on aggregations of lower-level figures (Middle Layer Super Output Area) that were derived using a combination of responses to the Family Resources Survey and information from the 2011 Census and administrative data.',
    downloads: null,
    keywords: ['inequality', 'money', 'poverty'],
    methodologies: {
      href: 'https://www.trustforlondon.org.uk/data/poverty-borough/',
      title: 'Sources and notes',
    },
    related_datasets: null,
    release_date: '2020-12-31', // Date in 2013-14 unknown. Aggregated study date is 2020.
    // Metadata quotes need double escapes for now.
    title: `Proportion of individuals in poverty (%)`,
    source: 'Trust for London',
    sampleSize: null,
    indicatorGroup: 'poverty',
    datasetLink: 'https://www.trustforlondon.org.uk/data/poverty-borough/',
  };

  return [poverty, metadata];
}
