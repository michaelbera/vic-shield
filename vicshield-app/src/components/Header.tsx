import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#111324]">
      <div className="font-bold text-xl">
        {" "}
        <Link to="/">VicShield</Link>
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
      <button className="bg-blue-600 px-4 py-2 rounded-lg">Get Started</button>
    </nav>
  );
};

export default Navbar;
