import fs from 'fs';

import lifeExpectancy from '../dataFormatters/lifeExpectancy.mjs';
import lowPay from '../dataFormatters/lowPay.mjs';
import unemploymentBenefits from '../dataFormatters/unemploymentBenefits.mjs';
import wellbeing from '../dataFormatters/wellbeing.mjs';

/** jsonToSql is a scripting function that takes in inputted jsons with datasets
 * These jsons are then turned into something that is easy to automate in the code
 * Adding any other metadata we need to the sql which will then update our db
 */
const jsonToSql = async () => {
  const [happiness, happinessMetadata] = await wellbeing(
    "./datasets/happiness.json",
    "happiness",
  );
  const [anxiety, anxietyMetadata] = await wellbeing(
    "./datasets/anxiety.json",
    "anxiety",
  );
  const [femaleLifeExpectancy, femaleLifeExpectancyMetadata] = await lifeExpectancy(
    "./datasets/female_life_expectancy.json",
    "life expectancy",
  );
  const [maleLifeExpectancy, maleLifeExpectancyMetadata] = await lifeExpectancy(
    "./datasets/male_life_expectancy.json",
    "life expectancy",
  );
  const [totalClaim, totalClaimMetadata] = await unemploymentBenefits();
  const [partTimeLowPay, partTimeLowPayMetadata] = await lowPay(
    './datasets/London_jobs_low_paid.json',
    'Percentage of part-time jobs held by residents that are low paid',
    'part-time',
  );
  const [fullTimeLowPay, fullTimeLowPayMetadata] = await lowPay(
    './datasets/London_jobs_low_paid.json',
    'Percentage of full-time jobs held by residents that are low paid',
    'full-time',
  );

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
  sqlOutput += `('total JSA and UC claimants', '${JSON.stringify(
    totalClaim
  )}', '${JSON.stringify(totalClaimMetadata)}'),\n`;
  sqlOutput += `('full-time low paid residents', '${JSON.stringify(
    fullTimeLowPay
  )}', '${JSON.stringify(fullTimeLowPayMetadata)}'),\n`;
  sqlOutput += `('part-time low paid residents', '${JSON.stringify(
    partTimeLowPay
  )}', '${JSON.stringify(partTimeLowPayMetadata)}'),\n`;

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
