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

export default function cardDataArranger(arr, location) {
  return arr.map((dataset) => {
    //Gives us the array of data in the dataset
    const dataArray = dataset.data.data;

    // Inits variables for the card object we're building
    const allCurrentYearData = sortByYearReturningOneYear(dataArray, [0, 35]);
    const lastYearsData = sortByYearReturningOneYear(dataArray, [35, 70]);
    const boroughCurrentYearData = allCurrentYearData
      .filter((data) => {
        return data.Geography === "United Kingdom" ||
          data.Geography === "London"
          ? false
          : true;
      })
      .sort((a, b) => b.Value - a.Value);

    const locationData =
      getDataByGeography(allCurrentYearData, location) || null;
    const ukData =
      getDataByGeography(allCurrentYearData, "United Kingdom")?.Value || null;
    const londonData = getDataByGeography(allCurrentYearData, "London")?.Value || null;
    const ranking =
      boroughCurrentYearData.findIndex((item) => item.Geography === location) +
      1; // +1 as 0 indexed
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
