import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import {
  selectDistinctTopicsWithData,
  selectTopicsWithLinkedData,
} from "../database/model";
import selectOptions from "../utils/selectOptions";
import useChoropleth from "../components/hooks/useChoropleth";
import Loading from "../components/Loading";
import StyleSelect from "../components/StyleSelect";
import Tooltip from "../components/Tooltip";

const sortByYearReturningOneYear = (arr, slice) => {
  return arr
    .sort((a, b) => {
      return (
        parseInt(b.Time.substring(0, 4)) - parseInt(a.Time.substring(0, 4))
      );
    })
    .slice(slice[0], slice[1]);
};

export async function getServerSideProps() {
  //topics and indicators for dropdown menu
  const topics = await selectDistinctTopicsWithData();
  const allIndicatorOptions = await selectTopicsWithLinkedData();
  const filteredAllIndicators = allIndicatorOptions.filter(
    (optionA, index, arr) =>
      arr.findIndex((optionB) => optionB.indicator === optionA.indicator) ===
      index
  );
  const topicOptions = [
    { value: "All", label: "All" },
    ...selectOptions(topics),
  ];

  return {
    props: {
      topicOptions,
      allIndicatorOptions,
      filteredAllIndicators,
    },
  };
}

export default function Map({
  topicOptions,
  allIndicatorOptions,
  filteredAllIndicators,
}) {
  const [topic, setTopic] = useState({ value: "All", label: "All" });
  const [indicator, setIndicator] = useState(null);
  const [indicatorOptions, setIndicatorOptions] = useState(
    selectOptions(filteredAllIndicators, 'indicator', 'indicator_group')
  );
  const [mapUrl, mapLoading, setMapDataAndSupporting] = useChoropleth();

  //filters viewable indicators on the basis of chosen topic
  useEffect(() => {
    const filteredIndicators =
      topic.value === "All"
        ? filteredAllIndicators
        : allIndicatorOptions.filter((option) => option.name === topic.value);
    const newOptions = selectOptions(filteredIndicators, 'indicator', 'indicator_group');
    setIndicatorOptions(newOptions);
  }, [topic, allIndicatorOptions, filteredAllIndicators]);

  //once indicator is chosen, this filters all boroughs (but not London and UK) to give data for the most recent year in the dataset
  useEffect(() => {
    if (indicator !== null) {
      const indicatorToFilter = indicator.value;
      fetch("/api/dataset-by-indicator", {
        method: "POST",
        body: JSON.stringify({ indicator: indicatorToFilter }),
      })
        .then((resolve) => resolve.json())
        .then((json) => json.dataset)
        .then((dataset) => {
          const data = dataset.data.data
            .filter((dataset) => dataset.Geography !== "London")
            .filter((dataset) => dataset.Geography !== "United Kingdom");
          setMapDataAndSupporting({
            dataset: sortByYearReturningOneYear(data, [0, 33]),
            indicator: indicatorToFilter,
            rank_mode: dataset.data.rank_mode,
          });
        });
    }
  }, [setMapDataAndSupporting, indicator]);

  //clicking a borough on the map redirects the user to the relevant indicator page
  const router = useRouter();
  useEffect(() => {
    function regionClick(event) {
      if (indicator !== null) {
        router.push(`/${event.data.Location}/indicator/${indicator.value}`);
      }
    }
    // datawrappers own event listeners allow us to be able to click the iframes
    datawrapper.on("region.click", regionClick);
    // Doing some cleansing by removing the event listent after click
    return () => datawrapper.off("region.click", regionClick);
  }, [indicator, router]);

  return (
    <>
      <form method="POST" className="grid place-items-center gap-3 p-10">
        <div className="flex justify-around w-full max-w-xl m-auto flex-wrap">
          <StyleSelect
            defaultValue={topic}
            options={topicOptions}
            id="topic"
            setChange={setTopic}
          />
          <div className={mapLoading ? "pointer-events-none" : null}>
            <StyleSelect
              options={indicatorOptions}
              id="indicator"
              setChange={setIndicator}
              tabIndex={mapLoading ? "-1" : "0"}
            />
          </div>
        </div>
      </form>

      <div className={`w-1/2 h-[800px] m-auto`}>
        { indicator?.value ? (
          <h2 className="text-[30px] leading-relaxed font-semibold">
            A map of {indicator?.value} in London
            <Tooltip
              indicator={indicator?.value}
              indicatorGroup={indicator?.indicator_group}
            />
          </h2>
        ) : null}

        {mapLoading ? (
          <Loading />
        ) : (
          mapUrl ? (
          <iframe
            title={`Map of ${indicator?.value} in London`}
            src={mapUrl}
            className="w-full min-w-full h-full"
            scrolling="no"
            frameBorder="0"
          ></iframe>
          ) : undefined
        )}
      </div>
    </>
  );
}
