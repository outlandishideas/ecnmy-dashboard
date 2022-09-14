import Link from "next/link";

export default function LocalStoryCard() {
  return (
    <div className="flex flex-col w-1/4 justify-evenly min-w-[320px] max-w-[360px]">
      <div className="bg-ecnmy-white mb-1 flex flex-col rounded-t-lg ">
        <h2 className="relative overflow-visible bg-ecnmy-navy self-center text-ecnmy-white m-3 p-2 text-center justify-between rounded-lg w-10/12 text-lg ">
          Local Stories
        </h2>
      </div>
      <div className="bg-ecnmy-white mb-1 p-4 rounded-b-lg h-full flex flex-col items-center justify-between">
        <h3 className="text-ecnmy-navy text-4xl text-center font-semibold">
          Are you a journalist?
        </h3>
        <ul className="list-disc m-4 text-base"></ul>
        <section className="flex justify-between items-center">
          <div className="flex items-center">
            Access our network of contributors who can share their lived experience of this economic issue in this local area.
          </div>
        </section>
        <section className="w-full">
          <Link href={`https://weare.ecnmy.org/about-us/contact-us/`}>
            <a className="emphasised">
              More Info
            </a>
          </Link>
        </section>
      </div>
    </div>
  );
}
