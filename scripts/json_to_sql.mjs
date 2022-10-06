import fs from 'fs';

import housePriceEarningsRatio from '../dataFormatters/housePriceEarningsRatio.mjs';
import lifeExpectancy from '../dataFormatters/lifeExpectancy.mjs';
import lowPay from '../dataFormatters/lowPay.mjs';
import povertyRate from '../dataFormatters/povertyRate.mjs';
import unemploymentBenefits from '../dataFormatters/unemploymentBenefits.mjs';
import wellbeing from '../dataFormatters/wellbeing.mjs';
import indicatorGroup from '../utils/indicatorGroup.js';

/** jsonToSql is a scripting function that takes in inputted jsons with datasets
 * These jsons are then turned into something that is easy to automate in the code
 * Adding any other metadata we need to the sql which will then update our db
 */
const jsonToSql = async () => {
  const [happiness, happinessMetadata] = await wellbeing(
    "./datasets/happiness.json",
    indicatorGroup("happiness"),
    'happy',
  );
  const [anxiety, anxietyMetadata] = await wellbeing(
    "./datasets/anxiety.json",
    indicatorGroup("anxiety"),
    'anxious',
  );
  const [femaleLifeExpectancy, femaleLifeExpectancyMetadata] = await lifeExpectancy(
    "./datasets/female_life_expectancy.json",
    indicatorGroup("life expectancy (female)"),
    'women',
  );
  const [maleLifeExpectancy, maleLifeExpectancyMetadata] = await lifeExpectancy(
    "./datasets/male_life_expectancy.json",
    indicatorGroup("life expectancy (male)"),
    'men',
  );
  const [totalClaim, totalClaimMetadata] = await unemploymentBenefits();
  const [partTimeLowPay, partTimeLowPayMetadata] = await lowPay(
    './datasets/London_jobs_low_paid.json',
    'Percentage of part-time jobs held by residents that are low paid',
    'part-time',
  );
  const [povertyRates, povertyRatesMetadata] = await povertyRate(
    './datasets/poverty_rates_by_London_borough_2013_2014.json',
    'Poverty rate',
  );
  const [
    housePriceEarningsRatioData,
    housePriceEarningsRatioMetadata
  ] = await housePriceEarningsRatio();

  let sqlOutput = /*SQL*/ `BEGIN;\n\nINSERT INTO datasets (indicator, data, metadata) VALUES\n`;

  sqlOutput += `
    ('happiness', '${JSON.stringify(happiness)}', '${JSON.stringify(
    happinessMetadata
  )}'),\n`;
  sqlOutput += `
    ('anxiety', '${JSON.stringify(anxiety)}', '${JSON.stringify(
    anxietyMetadata
  )}'),\n
  `;
  sqlOutput += `
    ('life expectancy (female)', '${JSON.stringify(
      femaleLifeExpectancy
    )}', '${JSON.stringify(femaleLifeExpectancyMetadata)}'),\n
  `;
  sqlOutput += `
    ('life expectancy (male)', '${JSON.stringify(
      maleLifeExpectancy
    )}', '${JSON.stringify(maleLifeExpectancyMetadata)}'),\n
  `;
  sqlOutput += `('unemployment benefits claimants', '${JSON.stringify(
    totalClaim
  )}', '${JSON.stringify(totalClaimMetadata)}'),\n`;
  sqlOutput += `('low paid jobs (part time)', '${JSON.stringify(
    partTimeLowPay
  )}', '${JSON.stringify(partTimeLowPayMetadata)}'),\n`;
  sqlOutput += `('poverty rate', '${JSON.stringify(
    povertyRates
  )}', '${JSON.stringify(povertyRatesMetadata)}'),\n`;
  sqlOutput += `('housing affordability', '${JSON.stringify(
    housePriceEarningsRatioData
  )}', '${JSON.stringify(housePriceEarningsRatioMetadata)}'),\n`;

  sqlOutput = sqlOutput.substring(0, sqlOutput.length - 2) + ";";
  sqlOutput += "\n\nCOMMIT;";

  fs.writeFile("./database/datasets.sql", sqlOutput, (err) => {
    if (err) {
      console.error(err);
    }
    console.log("Successfully wrote datasets.sql");
  });
};

jsonToSql();
