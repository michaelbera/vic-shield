const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#111324]">
      <div className="font-bold text-xl">VicShield</div>
      <ul className="flex gap-6">
        <li>Solution</li>
        <li>Features</li>
        <li>Roadmap</li>
        <li>Pricing</li>
      </ul>
      <button className="bg-blue-600 px-4 py-2 rounded-lg">Get Started</button>
    </nav>
  )
}

export default Navbar
