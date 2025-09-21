import { Link } from "react-router-dom";
import Container from "./UI/Container";

const Navbar: React.FC = () => {
  return (
    <Container innerClassName="p-4">
      <nav className="flex justify-between items-center px-2 py-2 bg-[#111324] rounded-full">
        <div className="font-bold text-xl">
          <Link to="/" className="flex flex-row items-center gap-2">
            <img src="/logo.png" className="w-12 h-auto object-contain" />
            <p>VicShield</p>
          </Link>
        </div>
        <ul className="flex gap-6">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            {" "}
            <Link to="/kyc">KYC</Link>
          </li>
          <li>Roadmap</li>
          <li>Pricing</li>
        </ul>
        <button className="btn btn-primary rounded-full">Use Vicshield</button>
      </nav>
    </Container>
  );
};

export default Navbar;
