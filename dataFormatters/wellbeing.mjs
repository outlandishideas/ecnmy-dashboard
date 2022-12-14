import fs from "fs";
import fetch from "node-fetch";

async function jsonParser(file) {
  const rawdata = fs.readFileSync(file);
  const data = await JSON.parse(rawdata);
  return data;
}

export default async function wellbeing(route, indicatorGroup, indicatorLabel) {
  const emotion = await jsonParser(route);

  emotion.data.forEach((item) => {
    delete Object.assign(item, { ["Value"]: item["V4_3"] })["V4_3"];
    delete item["Data Marking"];
    delete item["yyyy-yy"];
  });

  const apiUrl =
    "https://api.beta.ons.gov.uk/v1/datasets/wellbeing-quarterly/editions/time-series/versions/4/metadata";
  const metadataAPI = await fetch(apiUrl).then((resolve) => resolve.json());
  const datasetLink = apiUrl
    .replace("api.beta.", "www.")
    .replace("v1/", "")
    .replace("metadata", "");
  const releaseDate = metadataAPI.release_date.substring(0, 10);

  const metadata = {
    description: `This data shows the average score given by respondents when asked to rate their answer to the question "overall, how ${indicatorLabel} did you feel yesterday?" on a scale where 0 is "not at all" and 10 is "completely".`,
    downloads: metadataAPI.downloads,
    keywords: metadataAPI.keywords,
    methodologies: metadataAPI.methodologies,
    related_datasets: metadataAPI.related_datasets,
    release_date: releaseDate,
    title: metadataAPI.title,
    source: "ONS",
    sampleSize: "150,000 (UK wide)",
    indicatorGroup,
    datasetLink: datasetLink,
  };

  return [emotion, metadata];
}
