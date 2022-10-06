// Sorts an array by Time (In our case year, but the first four characters is the year)
// Then slices giving values back based on what a user wants (in our case splits of 35 as that is the number of data points we have)
const sortByYearReturningOneYear = (arr, slice) => {
  return arr
    .sort((a, b) => {
      return (
        parseInt(b.Time.substring(0, 4)) - parseInt(a.Time.substring(0, 4))
      );
    })
    .slice(slice[0], slice[1]);
};

// Gets all the data by the object property Geography, or undefined if no such data.
export const getDataByGeography = (arr, Geography) => {
  const foundIndex = arr.findIndex((item) => item.Geography === Geography);

  if (foundIndex === -1) {
    return undefined;
  }

  return arr[foundIndex];
};

// Find the percentage change based on a previous years values
const findChange = (current, previous, Geography) => {
  if (!previous || previous.length === 0) {
    return null;
  }

  const currentValue = getDataByGeography(current, Geography)?.Value || 0;
  const previousValue = getDataByGeography(previous, Geography)?.Value || 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

const getCurrentYearSorted = (allCurrentYearData, reverseRanks) => {
  return allCurrentYearData
    .filter((data) => {
      return data.Geography !== 'United Kingdom' && data.Geography !== 'London';
    })
    .sort((a, b) => reverseRanks ? (a.Value - b.Value) : (b.Value - a.Value));
}

export default function cardDataArranger(arr, location) {
  return arr.map((dataset) => {
    //Gives us the array of data in the dataset
    const dataArray = dataset.data.data;

    // Inits variables for the card object we're building
    // As of 6/10/22, the one reverse rank dataset is also the one that includes London but didn't have UK-wide
    // data, so for now we hack it to reflect the row count based on this. To future proof it, probably as part
    // of ECONOMY-38, we'll likely want to rethink this more thoroughly or at a minimum add a rank_data_points
    // field to the dataset JSON.
    let dataPointsCount = (dataset.data.rank_mode === 'reversed') ? 34 : 35;
    const allCurrentYearData = sortByYearReturningOneYear(dataArray, [0, dataPointsCount]);
    const lastYearsData = sortByYearReturningOneYear(dataArray, [dataPointsCount, 2 * dataPointsCount]);
    const boroughCurrentYearData = getCurrentYearSorted(
      allCurrentYearData,
      dataset.data.rank_mode === 'reversed',
    );

    const locationData =
      getDataByGeography(allCurrentYearData, location) || null;
    const ukData =
      getDataByGeography(allCurrentYearData, "United Kingdom")?.Value || null;
    const londonData = getDataByGeography(allCurrentYearData, "London")?.Value || null;

    let ranking = null;
    // Skip for datasets with currently-dubious calculations. See ECONOMY-38 + linked.
    if (dataset.data.rank_mode !== 'none') {
      ranking = boroughCurrentYearData
        .findIndex((item) => item.Geography === location)
        + 1; // +1 as 0 indexed
    }

    const change = findChange(allCurrentYearData, lastYearsData, location);
    const isNull = locationData === null || locationData?.Value === '';
    const currentYear = allCurrentYearData[0].Time;
    const previousYear = lastYearsData.length > 0 ? lastYearsData[0].Time : null;

    return {
      cardData: {
        locationData: locationData || null,
        ukData,
        londonData,
        ranking,
        change,
        isNull,
        currentYear,
        previousYear,
      },
      indicator: dataset.indicator,
      metadata: dataset.metadata,
    };
  });
}
