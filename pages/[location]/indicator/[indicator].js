import Link from 'next/link';

import useDatawrapper from "../../../components/hooks/useDatawrapper";
import { selectDatasetByIndicator } from "../../../database/model";
import Loading from "../../../components/Loading";
import cardDataArranger from "../../../utils/cardDataArranger";
import sanityClient from '../../../utils/sanityClient';

export async function getServerSideProps({ params }) {
  // Get the parameters of the url
  const indicator = params.indicator;
  const location = params.location;

  let indicatorDetail = null;
  const query = '*[_type == "indicator" && name == $indicator] {detail}';
  const sanityParams = { indicator };
  const indicators = await sanityClient.fetch(query, sanityParams);
  if (indicators.length > 0) {
    indicatorDetail = indicators[0].detail;
  }

  // Select the single dataset needed for the specific indicator
  const dataset = await selectDatasetByIndicator(indicator);

  const metadata = dataset?.metadata || null;
  //Data for the specific location clicked on for more info
  const boroughData = dataset.data.data.filter(
    (object) => object.Geography === location
  );
  const [locationDataset] = cardDataArranger([dataset], location);

  let chartCsv = null;
  let tableCsv = null;

  // Set up chart + table only if there's data for more than one point in time.
  if (boroughData.length > 1) {
    // Starting the csvs to send to datawrapper-proxy
    chartCsv = `Year,${indicator}\n`;
    tableCsv = `Year,${indicator}\n`;

    let boroughDataSortedByYearChart = boroughData.sort((a, b) => {
      return parseInt(a.Time.substring(0, 4)) - parseInt(b.Time.substring(0, 4));
    });
    let boroughDataSortedByYearTable = boroughData.sort((a, b) => {
      return parseInt(b.Time.substring(0, 4)) - parseInt(a.Time.substring(0, 4));
    });

    boroughDataSortedByYearChart.map((datum) => {
      chartCsv += `${datum["Time"].substring(0, 4)},${datum["Value"]}\n`;
    });
    boroughDataSortedByYearTable.map((datum) => {
      tableCsv += `${datum["Time"]},${datum["Value"]}\n`;
    });
  }

  return {
    props: {
      location,
      boroughData,
      metadata,
      locationDataset,
      chartCsv,
      tableCsv,
      indicator,
      indicatorDetail,
    },
  };
}

export default function Indicator({
  indicator,
  indicatorDetail,
  location,
  metadata,
  locationDataset,
  chartCsv,
  tableCsv,
}) {
  // [null, false] if no CSV.
  const [lineChartUrl, lineChartLoading] = useDatawrapper(
    chartCsv,
    indicator,
    location,
    "d3-lines"
  );

  // [null, false] if no CSV.
  const [tableUrl, tableLoading] = useDatawrapper(
    tableCsv,
    indicator,
    location,
    "tables"
  );

  const tableHeight = tableCsv ? `${(tableCsv.length * 3.9).toString()}px` : '0';

  return (
    <main>
      <h1 className="blue capitalize-first font-bold text-center text-3xl p-5">
        {locationDataset.indicator} in {location}
      </h1>

      <div className="flex items-center flex-wrap justify-around">
        { indicatorDetail && (
          <pre className="detail flex-[1_1_50%] p-5">
            {indicatorDetail}
          </pre>
        )}

        <div className="h-[400px] min-w-[310px] flex-[1_1_50%] p-5">
          {lineChartLoading === true ? (
            <Loading />
          ) : (
            lineChartUrl ? (
              <iframe
                title={`A chart showing the change in ${indicator} in ${location}`}
                id="datawrapper-chart-0jKkG"
                src={lineChartUrl}
                className="w-full min-w-full h-full"
                scrolling="no"
                frameBorder="0"
              ></iframe>
            ) : undefined
          )}
        </div>

        <div className="min-w-[310px] flex-[1_1_50%] p-5">
          {tableLoading === true ? (
            <Loading />
          ) : (
            tableUrl ? (
              <iframe
                style={{ height: tableHeight }}
                title={`A table for ${indicator} in ${location}`}
                id="datawrapper-chart-0jKkG"
                src={tableUrl}
                className="w-full min-w-full h-full"
                scrolling="no"
                frameBorder="0"
              ></iframe>
            ) : undefined
          )}
        </div>

        <div className="flex-[1_1_50%] p-5">
          <h2>
            <span className="font-semibold">Name of study:</span>{" "}
            <Link href={metadata.datasetLink}>
              <a className="underline text-blue-600 hover:text-ecnmy-navy visited:text-ecnmy-grape">
                {metadata.title}
              </a>
            </Link>
          </h2>
          <h3>
            <span className="font-semibold">Last updated:</span>{" "}
            {metadata.release_date.substring(0, 4)}
          </h3>
          {metadata.sampleSize ? (
            <h3>
              <span className="font-semibold">Sample size:</span>{" "}
              {metadata.sampleSize}
            </h3>
          ) : null}
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {metadata.description}
          </p>
        </div>
      </div>
    </main>
  );
}
