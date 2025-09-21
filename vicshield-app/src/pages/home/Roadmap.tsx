import Container from "~/components/UI/Container";

import BG from "~/statics/images/roadmap/background.png";

const Roadmap: React.FC = () => {
  return (
    <Container>
      <section className="flex flex-col px-6 md:px-8 gap-8 md:gap-16">
        <div
          className="page-title flex flex-col gap-4 md:gap-6 py-4 md:py-6 items-center text-center bg-no-repeat"
          style={{ backgroundImage: `url(${BG})`, backgroundSize: "100% 100%" }}
        >
          <span className="text-sm md:text-lg">THE ROADMAP TO RESHAPE</span>
          <p>The Future of Digital Signature and Contract Management</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="card bg-base-300 border-gradient p-4 md:p-6">
            <p>tiel</p>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Roadmap;
