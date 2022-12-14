import fs from "fs";
import fetch from "node-fetch";

async function jsonParser(file) {
  const rawdata = fs.readFileSync(file);
  const data = await JSON.parse(rawdata);
  return data;
}

export default async function lifeExpectancy(route, indicatorGroup, genderLabel) {
  const gender = await jsonParser(route);

  gender.data.forEach((item) => {
    delete Object.assign(item, { ["Value"]: item["v4_2"] })["v4_2"];
    delete item["Sex"];
    delete item["sex"];
    delete item["age-groups"];
    delete item["AgeGroups"];
    delete item["two-year-intervals"];
  });

  const apiUrl =
    "https://api.beta.ons.gov.uk/v1/datasets/life-expectancy-by-local-authority/editions/time-series/versions/1/metadata";
  const metadataAPI = await fetch(apiUrl).then((resolve) => resolve.json());
  const datasetLink = apiUrl
    .replace("api.beta.", "www.")
    .replace("v1/", "")
    .replace("metadata", "");
  const releaseDate = metadataAPI.release_date.substring(0, 10);

  const metadata = {
    description: `This data calculates the average age ${genderLabel} can expect to live to. It is a period life expectancy, which means it assumes the mortality rate for a specific demographic group will remain the same throughout their lives.`,
    downloads: metadataAPI.downloads,
    keywords: metadataAPI.keywords,
    methodologies: metadataAPI.qmi,
    related_datasets: metadataAPI.publications,
    release_date: releaseDate,
    title: metadataAPI.title,
    source: "ONS",
    sampleSize: "320,000 (UK wide)",
    indicatorGroup,
    datasetLink: datasetLink,
  };

  return [gender, metadata];
}
