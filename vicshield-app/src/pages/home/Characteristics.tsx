import Container from "~/components/UI/Container";

import CT from "~/statics/images/characteristics/contract.png";
import CHART from "~/statics/images/characteristics/chart.png";
import CHART_FOLDER from "~/statics/images/characteristics/chart_folder.png";
import LIGHT from "~/statics/images/characteristics/light.png";

const Characteristics: React.FC = () => {
  return (
    <Container>
      <section className="flex flex-col px-6 md:px-8 gap-4 pb-6 md:pb-8">
        <div className="page-title flex flex-col gap-2 items-center">
          <p>Characteristics</p>
          <span className="w-full md:w-8/12 text-center">
            Seamless integrations across EVM and non-EVM chains, fortified by
            cutting-edge MPC-TSS and ZK innovations.
          </span>
        </div>
        {/* contract */}
        <div className="card-gradient gradient-bottom-left gradient-neutral">
          <div className="card-gradient-body flex flex-col gap-2 md:gap-3 items-center p-6 md:p-8 bg-base-300 text-center text-base md:text-xl">
            <img
              src={CT}
              alt="contract"
              className="w-1/3 md:w-40 h-auto object-contain"
            />
            <p className="mb-3">Data Privacy & Security</p>
            <p>Signature timestamp on with fully transparent action history</p>
            <p>No manipulation from centralized authority</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-8 gap-x-3 md:gap-x-4">
          {/* no gas */}
          <div className="card-gradient gradient-bottom-left gradient-neutral">
            <div className="card-gradient-body flex flex-col gap-2 md:gap-3 items-center p-6 md:p-8 bg-base-300 text-center text-base md:text-xl">
              <img
                src={LIGHT}
                className="w-1/3 md:w-40 h-auto object-contain"
                alt="zero gas"
              />
              <h3 className="font-semibold mb-2">Data Privacy & Security</h3>
              <p className="text-gray-400 text-sm">
                Signature information can be fully transparent...
              </p>
            </div>
          </div>
          {/* operation management streamline */}
          <div className="card-gradient gradient-bottom-left gradient-neutral">
            <div className="card-gradient-body flex flex-col gap-2 md:gap-3 items-center p-6 md:p-8 bg-base-300 text-center text-base md:text-xl">
              <img
                src={CHART_FOLDER}
                className="w-1/3 md:w-40 h-auto object-contain"
                alt="management"
              />
              <h3 className="font-semibold mb-2">Zero Gas Transaction</h3>
              <p className="text-gray-400 text-sm">
                Thanks to VICSHIELD token standard.
              </p>
            </div>
          </div>

          {/* data Availability */}
          <div className="card-gradient gradient-bottom-left gradient-neutral">
            <div className="card-gradient-body flex flex-col gap-2 md:gap-3 items-center p-6 md:p-8 bg-base-300 text-center text-base md:text-xl">
              <img
                src={CHART}
                className="w-1/3 md:w-40 h-auto object-contain"
                alt="Availability"
              />
              <h3 className="font-semibold mb-2">
                Data Availability & Preservation
              </h3>
              <p className="text-gray-400 text-sm">
                Through decentralized storage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Characteristics;
