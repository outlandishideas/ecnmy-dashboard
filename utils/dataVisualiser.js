import { callDWAndLogErrors } from './dataWrapper';

/**
 * @typedef {Object} ChartResult
 * @property {string} chartId
 * @property {string} chartUrl
 *
 * @return {ChartResult | undefined}
 */
export default async function dataVisualiser(
  indicatorCsv,
  indicator,
  location,
  chartType
) {
  let title;
  if (chartType === "d3-lines") {
    title = `A chart showing change in ${indicator} in ${location}`;
  } else if (chartType === "tables") {
    title = `Table: ${indicator} in ${location}`;
  } else if (chartType === "d3-maps-choropleth") {
    // For maps we show title outside the embed, so we can put an interactive tooltip icon alongside it.
    title = ' ';
  }

  //initialises empty chart
  const postResponse = await callDWAndLogErrors('/charts', 'POST', JSON.stringify({
    folderId: parseInt(process.env.DATAWRAPPER_FOLDER_ID, 10),
    organizationId: process.env.DATAWRAPPER_TEAM_ID,
    title: title,
    type: chartType,
    lastEditStep: 3,
  }));

  if (postResponse === undefined) {
    return undefined;
  }

  //chartId needed for URL that will ultimately be put into the iframe on the page
  const chartId = postResponse.id;

  if (indicatorCsv === null) {
    console.log('Bailing out as we have no data!');
    return undefined;
  }

  //populates chart with data
  const putResponse = await callDWAndLogErrors(`/charts/${chartId}/data`, 'PUT', indicatorCsv, true);

  //for choropleth, sets basemap and adds tooltip
  if (chartType === "d3-maps-choropleth") {
    const patchResponse = await callDWAndLogErrors(`/charts/${chartId}`, 'PATCH', JSON.stringify({
      metadata: {
        axes: {
          keys: "code",
          values: "literacy-rate",
        },
        visualize: {
          basemap: "uk-lads-greater-london",
          "map-key-attr": "lad15nm",
        },
      },
    }));

    // This adds the hover tooltip for the choropleth
    const addTooltip = await callDWAndLogErrors(`/charts/${chartId}`, 'PATCH', JSON.stringify({
      metadata: {
        visualize: {
          tooltip: {
            body: `{{ indicator }}`,
            title: "{{ location }}",
            fields: {
              location: "location",
              indicator: indicator,
            },
          },
        },
      },
    }));
  }

  //publishes chart online with chartId in the URL
  const publishResponse = await callDWAndLogErrors(`/charts/${chartId}/publish`, 'POST');

  if (publishResponse === undefined) {
    return undefined;
  }

  const chartUrl = publishResponse.data.publicUrl;
  /**
   * @param number
   * @link https://tracker.outlandish.com/issue/ECONOMY-4#focus=Comments-87-27040.0-0
   */
  const publishVersion = publishResponse.version - 1;

  // We *could* potentially use the custom webhooks feature in DataWrapper settings, but this is a lot of
  // complexity we don't have time for this sprint (e.g. to have the server ping the client with Websockets),
  // *and* we'd eventually hit limitations with it only having 1 URL (what about Production?). So for now,
  // to make this less flaky than the first proof of concept we poll every 0.5s for up to 7.5s using the publish
  // status endpoint.

  const waitBetweenAttempts = 500; // ms
  const maxAttempts = 15;

  const checkPublished = async (attemptNumber) => {
    const publishStatusResponse = await callDWAndLogErrors(`/charts/${chartId}/publish/status/${publishVersion}`, 'GET');
    if (publishStatusResponse.progress.includes('done')) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (attemptNumber > maxAttempts) {
          reject();
        }

        resolve(checkPublished(attemptNumber + 1));
      }, waitBetweenAttempts);
    });
  };

  await checkPublished(0);

  return {
    chartId,
    chartUrl,
  };
}
