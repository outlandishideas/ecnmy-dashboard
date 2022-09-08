import { useState } from "react";
import { useRouter } from "next/router";

import { useSanityPreloads } from './SanityPreloads.jsx';

const howDesc = {
  "/": {
    page: "Home",
  },
  "/[location]/topic/[topic]": {
    page: "Topic",
  },
  "/[location]/indicator/[indicator]": {
    page: "Indicator",
  },
  "/map": {
    page: "Map",
  },
};

export default function Help({ params }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sanityPreloadsState, setSanityPreloadsState] = useSanityPreloads();

  const info = howDesc[useRouter().route];

  if (sanityPreloadsState.help) {
    const matchedHelpItem = sanityPreloadsState.help.find((help) => help.page === info.page);
    if (matchedHelpItem !== undefined) {
      info.help = matchedHelpItem.help;
    }
  }

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={togglePopup}
        className={
          isOpen
            ? "text-ecnmy-charcoal underline"
            : "hover:text-ecnmy-charcoal hover:underline"
        }
      >
        Help
      </button>
      {isOpen ? (
        <div className="greyed-bg fixed w-full h-screen top-0 left-0 z-[1]">
          <div className="box relative h-auto rounded p-5 overflow-auto bg-ecnmy-white border">
            <span
              className="close-icon bg-ecnmy-charcoal border text-white"
              onClick={togglePopup}
            >
              x
            </span>
            <div className="text-ecnmy-charcoal text-base">
              <h2 className="text-[30px] leading-relaxed font-semibold">
                {info.title || 'Help'}
              </h2>
              <p className="leading-loose">
                <ul>
                  {info.help.map(helpItem => (<li>{helpItem}</li>))}
                </ul>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
