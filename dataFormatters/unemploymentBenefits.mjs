import fs from 'fs';

async function jsonParser(file) {
  const rawdata = fs.readFileSync(file);
  const data = await JSON.parse(rawdata);
  return data;
}

export default async function unemploymentBenefits() {
  const totalClaim = await jsonParser('./datasets/totalClaim.json');

  const totalClaimData = totalClaim.data;

  const tidyClaimData = totalClaimData.flatMap((item) => {
    const Geography = item.Area;
    const [_, ...entries] = Object.entries(item);
    return entries.map((entry) => {
      return {
        Geography: Geography,
        Time: entry[0].substring(4),
        Value: entry[1],
      };
    });
  });

  totalClaim.data = tidyClaimData;
  let totalClaimMetadata = {
    description:
      "This data shows the number of residents who are receiving two types of welfare - Job Seekers Allowance and Universal Credit - that the UK government pays to unemployed people who meet the schemes’ criteria.",
    downloads: null,
    keywords: ["poverty", "universal credit", "jobseekers allowance"],
    methodologies: {
      href: "https://www.nomisweb.co.uk/query/asv2htm",
      title: "Warnings and notes",
    },
    related_datasets: null,
    title: "Claimant count by age and sex",
    release_date: "2022-07-19",
    source: "Nomis",
    sampleSize: null,
    indicatorGroup: "unemployment benefits claimants",
    datasetLink: "https://www.nomisweb.co.uk/sources/cc",
  };

  return [totalClaim, totalClaimMetadata];
}
