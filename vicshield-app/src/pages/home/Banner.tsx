import { useNavigate } from "react-router-dom";
import Container from "~/components/UI/Container";
import bg from "~/statics/images/banner/background.png";
import sImg from "~/statics/images/banner/s.png";
import { useTypingDecrypt } from "~/hooks/useTyping";
import { useLayoutEffect, useState } from "react";

const TEXTS = [
  "Add ultimate security to your mutual agreement",
  "Sign with Confidence. Contract with Transparency.",
];

const Banner: React.FC = () => {
  const navigate = useNavigate();
  const [triggerStart, setTriggerStart] = useState(false);
  const { textLines } = useTypingDecrypt(TEXTS, {
    start: triggerStart,
    speed: {
      typing: 30,
      flash: 30,
    },
    delay: 100,
  });

  const handleGetStarted = () => {
    navigate("/contracts");
  };

  useLayoutEffect(() => {
    setTriggerStart(true);
  }, []);

  return (
    <Container>
      <section className="relative grid grid-cols-12 py-20 px-6">
        <img
          src={bg}
          className="w-full h-full object-cover absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 z-0"
        />
        <div className="page-title col-span-full md:col-span-8 flex flex-col gap-4 md:gap-8 relative z-10">
          <h1>{textLines[0]}</h1>
          <span>{textLines[1]}</span>
          <button
            className="btn btn-primary btn-lg self-start relative z-20"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>
        <div className="col-span-full md:col-span-4 flex flex-col items-center justify-center relative z-10">
          <img
            className="w-full md:w-10/12 object-contain"
            src={sImg}
            alt="shield"
          />
        </div>
      </section>
    </Container>
  );
};

export default Banner;
