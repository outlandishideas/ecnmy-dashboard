export default function selectOptions(rows, key = "name", extraKey = null) {
  return rows.map((item) => {
    const summaryItem = {
      value: item[key],
      label: item[key],
    };

    if (extraKey !== null) {
      summaryItem[extraKey] = item[extraKey];
    }

    return summaryItem;
  });
}
