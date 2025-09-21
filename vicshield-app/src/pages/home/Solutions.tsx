import Container from "~/components/UI/Container";
import SQUARE from "~/statics/images/solution/square.png";

const Solutions: React.FC = () => {
  return (
    <Container>
      <section className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-8 gap-8 md:gap-16">
        <div className="page-title col-span-full flex flex-col items-center">
          <p>Solutions</p>
          <span className="text-center w-full md:w-9/12">
            Our platform strives to revolutionize digital signature security by
            eradicating the vulnerabilities inherent in traditional single-key
            custody models.
          </span>
        </div>
        <div className="w-full">
          <img
            src={SQUARE}
            className="w-full h-auto object-contain"
            alt="solution"
          />
        </div>
        <div className="flex flex-col">
          {/* item 1 */}
          <div
            tabIndex={0}
            className="collapse rounded-none border-b border-secondary"
          >
            <div className="collapse-title font-semibold text-lg md:text-3xl uppercase">
              VICSHIELD
            </div>
            <div className="collapse-content text-sm">
              Provide comprehensive digital signature and contract management
              solution with non-fungible data and transparent processes for
              individuals and businesses based on subscription model billed
              monthly and annually
            </div>
          </div>
          {/* item 2 */}
          <div
            tabIndex={0}
            className="collapse rounded-none border-b border-secondary"
          >
            <div className="collapse-title font-semibold text-lg md:text-3xl uppercase">
              Shield as a service
            </div>
            <div className="collapse-content text-sm">
              Provide comprehensive digital signature and contract management
              solution with non-fungible data and transparent processes for
              individuals and businesses based on subscription model billed
              monthly and annually
            </div>
          </div>
          {/* item 3 */}
          <div tabIndex={0} className="collapse">
            <div className="collapse-title font-semibold text-lg md:text-3xl uppercase">
              Scalability
            </div>
            <div className="collapse-content text-sm">
              Provide comprehensive digital signature and contract management
              solution with non-fungible data and transparent processes for
              individuals and businesses based on subscription model billed
              monthly and annually
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Solutions;
