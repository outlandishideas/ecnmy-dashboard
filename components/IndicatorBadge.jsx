import React, { useState } from 'react';

import { useSanityPreloads } from './SanityPreloads';
import Tooltip from './Tooltip';

/** Purple-bordered title, with Tooltip */
export default function IndicatorBadge({ indicator, indicatorGroup, outerHoverState = false }) {
  const [hover, setHover] = useState(false);
  const [sanityPreloadsState, setSanityPreloadsState] = useSanityPreloads();

  const indicators = sanityPreloadsState.indicators || [];
  const matchedIndicator = indicators.find(indicator => indicator.name === indicatorGroup);

  function handleHover() {
    setHover(!hover);
  }

  return (
    <h2 className="relative overflow-visible bg-ecnmy-grape self-center text-ecnmy-white m-3 p-2 text-center flex justify-between rounded-lg w-10/12 text-lg font-medium">
      <span
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        onFocus={handleHover}
        onBlur={handleHover}
        className="capitalize-first"
      >
        {indicator}
      </span>

      <Tooltip
        indicator={indicator}
        indicatorGroup={indicatorGroup}
        outerHover={hover}
       />
    </h2>
  );
}
