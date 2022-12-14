import Link from "next/link";
import { useRouter } from "next/router";
import Help from "./Help";

export default function NavBar() {
  const router = useRouter();
  //finds the active page (if there is one) to underline
  const active =
    router.route === "/" ? "home" : router.route === "/map" ? "map" : null;
  return (
    <nav className="grid place-items-center text-ecnmy-black m-auto px-4 h-16 text-2xl bg-ecnmy-mint font-bold">
      <section className="flex space-x-6">
        <div className="flex items-center">
          <Link href="/">
            <a
              className={
                active === "home"
                  ? "text-ecnmy-charcoal underline"
                  : "hover:text-ecnmy-charcoal hover:underline"
              }
            >
              Home
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/map">
            <a
              data-test-id="mapNavLink"
              className={
                active === "map"
                  ? "text-ecnmy-charcoal underline"
                  : "hover:text-ecnmy-charcoal hover:underline"
              }
            >
              Map
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <Help />
        </div>
      </section>
    </nav>
  );
}
