import Image from "next/image";
import LoadingGif from "../public/images/loading-11.gif";
export default function Loading() {
  return (
    <>
      <div className="grid place-items-center">
        <Image
          src={LoadingGif}
          alt="Loading spinner"
          width={320}
          height={180}
        />
        <p className="text-xl animate-pulse">Loading ......</p>
      </div>
    </>
  );
}
