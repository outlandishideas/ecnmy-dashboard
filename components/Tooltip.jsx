import { useImperativeHandle, useState } from 'react';

import { useSanityPreloads } from './SanityPreloads';

export default function Tooltip({ indicator, indicatorGroup, outerHover = false }) {
  const [hover, setHover] = useState(false);
  const [sanityPreloadsState, setSanityPreloadsState] = useSanityPreloads();

  const indicators = sanityPreloadsState.indicators || [];
  const matchedIndicator = indicators.find(indicator => indicator.name === indicatorGroup);

  function handleHover() {
    setHover(!hover);
  }

  return (
    <div className="tooltip-wrapper">
    {
      matchedIndicator ? (
        <span
          className="tooltip"
          tabIndex={0}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
          onFocus={handleHover}
          onBlur={handleHover}
        >
          &#9432;
        </span>
      ) : null
    }
    {
      matchedIndicator ? (
        <span
        className={`${
          (hover || outerHover)
            ? "tooltip-expansion absolute inset-x-0 bottom-12 bg-ecnmy-black rounded-lg text-ecnmy-white p-2 text-sm capitalize-first"
            : "hidden"
        }`}
        >
          <ul>
            <li>
              {matchedIndicator.tooltip}
            </li>
          </ul>
        </span>
      ) : null
    }
    </div>
  );
}
