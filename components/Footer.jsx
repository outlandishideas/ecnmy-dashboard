import Image from "next/image";
import Link from "next/link";
import { useEffect } from 'react';
import imageUrlBuilder from '@sanity/image-url'

import ecnmyLogo from "../public/images/ecnmy-logo-white-background.png";
import { useSanityPreloads } from './SanityPreloads.jsx';
import sanityClient from '../utils/sanityClient'

const sanityImageBuilder = imageUrlBuilder(sanityClient);

export default function Footer() {
  const [sanityPreloadsState, setSanityPreloadsState] = useSanityPreloads();

  useEffect(() => {
    // No-op – make sure we load in new Sanity preloads state and get sources, as it's async
    // + the footer renders right away.
  }, [sanityPreloadsState]);

  return (
    <>
      <footer className="text-xs pt-6 pb-8 px-11 flex justify-around items-center flex-wrap border-solid border-ecnmy-charcoal border-t-2 border-b-2">
        <div className="flex flex-row flex-wrap items-start gap-4">
          <p className="text-[16px] py-1 font-medium max-w-xs mb-2 flex flex-wrap">
            <strong>Data Sources</strong>
            Our dashboard uses data from the following sources:
          </p>

          <div className="justify-around items-center gap-2">
            <ul className="flex flex-row flex-wrap">
              {
                sanityPreloadsState.dataSources && sanityPreloadsState.dataSources.map((source, ii) => (
                  <li key={ii} className="source-logo">
                    <Link href={source.url}>
                      <a
                        className="w-44"
                        rel="noreferrer"
                        target="_blank"
                        data-test-id={source.name.replace(' ', '-') + '-logo'}
                      >
                        <picture>
                          <img
                            src={
                              sanityImageBuilder
                                .image(source.logo)
                                .auto('format') // webp if supported
                                .height(50)
                                .quality(100)
                                .url()
                              }
                            alt={source.name}
                          />
                        </picture>
                      </a>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </footer>
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap justify-around my-10 max-w-[75%] mx-auto">
        <Link href="https://www.ecnmy.org/">
          <a
            target="_blank"
            className="max-w-[200px]"
            rel="noreferrer"
            data-test-id="ecmy-logo"
          >
            <Image
              src={ecnmyLogo}
              alt="logo for the charity 'Economy'"
            />
          </a>
        </Link>
        <p className=" text-xs">
          <span className="font-semibold block">
            The Local Cost of Living Dashboard is run by Economy
          </span>
          <i>Economy</i>’s vision is of a flourishing and sustainable society in
          which there is diverse and inclusive public conversation about the
          economy, and economics is a tool everybody can use to make confident
          personal choices; articulate their needs, values and priorities; take
          action to shape the economy and participate in democracy.
        </p>
      </div>
    </>
  );
}
