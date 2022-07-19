const db = require("./connection.js");

const selectAllByServerSideParam = async (table) => {
  const SELECT_ALL = /*SQL*/ `
    SELECT *
    FROM ${table} -- as serverside this is ok to do and allows us to reuse this function
  `;
  return await db.query(SELECT_ALL).then((resolve) => resolve.rows);
};

const selectDataByTopicName = async (topic) => {
  const SELECT_DATA = /*SQL*/ `
    SELECT datasets.data, datasets.indicator
    FROM datasets
      JOIN datasets_topics ON datasets.id = datasets_topics.dataset_id
      JOIN topics ON topics.id = datasets_topics.topic_id
    WHERE topics.name = $1
  `;
  return await db.query(SELECT_DATA, [topic]).then((resolve) => resolve.rows);
};

module.exports = { selectAllByServerSideParam, selectDataByTopicName };
