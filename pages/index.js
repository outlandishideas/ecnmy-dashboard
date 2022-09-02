import SelectForm from "../components/SelectForm";
import {
  selectAllByServerSideParam,
  selectDistinctTopicsWithData,
} from "../database/model";

// Turns the rows got from the db into options for the react-select component
import selectOptions from "../utils/selectOptions";

import sanityClient from '../utils/sanityClient';

export async function getServerSideProps() {
  // Get locations and topics
  const locations = await selectAllByServerSideParam("locations");
  const topics = await selectDistinctTopicsWithData();

  // Turn these locations and topics into options for react-select
  const locationOptions = selectOptions(locations);
  const topicOptions = [
    { value: "All", label: "All" },
    ...selectOptions(topics),
  ];

  // TODO replace test copy load with an actual use case.
  let sanityTestCopy = 'Not loaded';
  const query = '*[_type == "indicator" && name == $theIndicator] {name, tooltip}';
  const params = {theIndicator: 'total JSA and UC claimants'};
  await sanityClient.fetch(query, params).then((indicators) => {
    indicators.forEach((indicator) => {
      sanityTestCopy = indicator.tooltip;
    })
  })

  return { props: { topicOptions, locationOptions, sanityTestCopy } };
}

export default function Home({ topicOptions, locationOptions, sanityTestCopy }) {
  return (
    <main>
      <h2>Copy test: {sanityTestCopy}</h2>

      <h1 className=" text-[50px] text-center font-bold text-ecnmy-charcoal mt-6 mb-4">
        LOCAL COST OF LIVING DATA DASHBOARD
      </h1>
      <SelectForm
        topicOptions={topicOptions}
        locationOptions={locationOptions}
      />
    </main>
  );
}


// old text size clamp(2.5rem,1.1666666666666667rem+6.666666666666667vw,4rem)
