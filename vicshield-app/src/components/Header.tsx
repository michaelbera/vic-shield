import { Link } from "react-router-dom";
import Container from "./UI/Container";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const Navbar: React.FC = () => {
  return (
    <Container className="relative z-10" innerClassName="pt-4">
      <nav className="flex justify-between items-center px-2 py-2 bg-[#111324] rounded-full">
        <div className="font-bold text-xl">
          <Link to="/" className="flex flex-row items-center gap-2">
            <img src="/logo.png" className="w-12 h-auto object-contain" />
            <p>VicShield</p>
          </Link>
        </div>
        <DynamicWidget />
      </nav>
    </Container>
  );
};

export default Navbar;
