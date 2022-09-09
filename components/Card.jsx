import Link from "next/link";
import React, { useState } from 'react';

import ToolTip from "./Tooltip";

export default function Card({ dataset, location }) {
  const [sourceDetailIsOpen, setSourceDetailIsOpen] = useState(false);

  const toggleSourceDetail = () => {
    setSourceDetailIsOpen(!sourceDetailIsOpen);
  };

  const cardData = dataset.cardData;
  if (cardData.isNull) {
    return null;
  }

  return (
    <div className="flex flex-col w-1/4 justify-evenly min-w-[320px] max-w-[360px]">
      <div className="bg-ecnmy-white mb-1 flex flex-col rounded-t-lg">
        <ToolTip
          indicator={dataset.indicator}
          indicatorGroup={dataset.metadata.indicatorGroup}
        />
      </div>

      <div className="bg-ecnmy-white mb-1 p-4 rounded-b-lg h-full flex flex-col  justify-between">
        {dataset.cardData.locationData?.Value === undefined ? null : (
          <h3 className="text-ecnmy-navy text-xxl text-center font-semibold">
            {dataset.cardData.locationData.Value.toLocaleString("en-UK")}
          </h3>
        )}
        <ul className="list-disc m-4 text-base">
          {cardData.change === null ? null : (cardData.change > 0 ? (
            <li>
              This has increased by {cardData.change?.toPrecision(3)}% from the
              previous collection ({cardData.previousYear})
            </li>
          ) : (
            <li>
              This has decreased by {-cardData.change?.toPrecision(3)}% from the
              previous collection ({cardData.previousYear})
            </li>
          ))}
          {cardData.ranking > 0 ? (
            <li>This ranks {cardData.ranking}/33 of the London Boroughs</li>
          ) : null}
          {location === "London" ? null : (
            <li>London: {cardData.londonData?.toLocaleString("en-UK")}</li>
          )}
          {location === "United Kingdom" ? null : cardData.ukData ? (
            <li>UK: {cardData.ukData?.toLocaleString("en-UK")}</li>
          ) : null}
        </ul>

        <section className="flex justify-between items-center ">
          <Link href={`/${location}/indicator/${dataset.indicator}`}>
            <a className="emphasised">
              More Info
            </a>
          </Link>

          <div className="flex items-center">
            <a
              onClick={toggleSourceDetail}
              className="emphasised"
            >
              {dataset.metadata.source}
              {", "}
              {cardData.currentYear}
            </a>
          </div>

          { sourceDetailIsOpen ? (
            <div className="greyed-bg fixed w-full h-screen top-0 left-0 z-[1]">
              <div className="box relative h-auto rounded p-5 overflow-auto bg-ecnmy-white border">
                <span
                  className="close-icon bg-ecnmy-charcoal border text-white"
                  onClick={toggleSourceDetail}
                >
                  x
                </span>

                <h2 className="text-[30px] leading-relaxed font-semibold">
                  {`${dataset.metadata.source}, ${cardData.currentYear}`}
                </h2>

                <div className="text-ecnmy-charcoal text-base">
                  <h3>
                    <span className="font-semibold">Name of study:</span>{" "}
                    <Link href={dataset.metadata.datasetLink}>
                      <a className="underline text-blue-600 hover:text-ecnmy-navy visited:text-ecnmy-grape">
                        {dataset.metadata.title}
                      </a>
                    </Link>
                  </h3>
                  <h3>
                    <span className="font-semibold">Last updated:</span>{" "}
                    {dataset.metadata.release_date.substring(0, 4)}
                  </h3>
                  {dataset.metadata.sampleSize ? (
                    <h3>
                      <span className="font-semibold">Sample size:</span>{" "}
                      {dataset.metadata.sampleSize}
                    </h3>
                  ) : null}
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {dataset.metadata.description}
                  </p>
                </div>
              </div>
            </div>
          ) : null
        }
        </section>
      </div>
    </div>
  );
}
