import fs from 'fs';

async function jsonParser(file) {
  const rawdata = fs.readFileSync(file);
  const data = await JSON.parse(rawdata);
  return data;
}

export default async function lowPay(path, property, jobType) {
  const pay = await jsonParser(path);

  pay.data.forEach((item) => {
    item.Geography = item.Borough;
    if (item[property] === 'NA') {
      item[property] = undefined;
    }

    item.Time = '2021-12';
    item.Value = item[property];
  });

  const metadata = {
    description: 'This data looks at jobs paid below London Living Wage across London boroughs. Data is restricted to jobs held by people who live in London (residence-based), and their job may be based outside of London.',
    downloads: null,
    keywords: ['inequality', 'jobs', 'money', 'poverty'],
    methodologies: {
      href: 'https://www.trustforlondon.org.uk/data/low-pay-in-London-boroughs/',
      title: 'Sources and notes',
    },
    related_datasets: null,
    release_date: '2021-12-31', // Date in 2021 unknown.
    // Metadata quotes need double escapes for now.
    title: `Proportion of borough residents'' ${jobType} jobs that are low-paid`,
    source: 'Trust for London',
    sampleSize: null,
    indicatorGroup: 'low pay',
    datasetLink: 'https://www.trustforlondon.org.uk/data/low-pay-in-London-boroughs/',
  };

  return [pay, metadata];
}
