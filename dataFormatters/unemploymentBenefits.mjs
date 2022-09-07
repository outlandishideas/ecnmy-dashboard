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
      "This experimental series counts the number of people claiming Jobseeker''s Allowance plus those who claim Universal Credit and are required to seek work and be available for work and replaces the number of people claiming Jobseeker''s Allowance as the headline indicator of the number of people claiming benefits principally for the reason of being unemployed.",
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
    indicatorGroup: "total JSA and UC claimants",
    datasetLink: "https://www.nomisweb.co.uk/sources/cc",
  };

  return [totalClaim, totalClaimMetadata];
}
