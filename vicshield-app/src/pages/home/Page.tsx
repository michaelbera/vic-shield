import MatrixEffect from "~/components/animations/MatrixEffect";
import Banner from "./Banner";
import Characteristics from "./Characteristics";
import Features from "./Features";
import Pricing from "./Pricing";
import Roadmap from "./Roadmap";
import Solutions from "./Solutions";

export default function HomePage() {
  return (
    <div className="relative w-full z-0">
      <div className="fixed top-0 left-0 w-screen h-screen z-0">
        <MatrixEffect />
      </div>
      <div className="relative w-full flex flex-col z-10">
        <Banner />
        <Characteristics />
        <Solutions />
        <Features />
        <Roadmap />
        <Pricing />
      </div>
    </div>
  );
}
