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

    item.Time = '2021';
    item.Value = item[property];
  });

  const metadata = {
    description: `This data shows the proportion of part-time workers who are paid less than the London Living Wage (LLW), which was £11.05 p/h in 2021.  The LLW is the London-weighted version of the Real Living Wage, an hourly rate calculated by the Living Wage Foundation as the minimum income needed for a full-time worker to meet their everyday needs.\n\nThis data is residence-based: it is linked to where workers live, not the location of their job.`,
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
