import { Fragment, useId } from "react";
import Container from "~/components/UI/Container";

import BG from "~/statics/images/roadmap/background.png";
import ICON1 from "~/statics/images/roadmap/icon-1.png";
import ICON2 from "~/statics/images/roadmap/icon-2.png";
import ICON3 from "~/statics/images/roadmap/icon-3.png";
import ICON4 from "~/statics/images/roadmap/icon-4.png";
import SHIELD from "~/statics/images/roadmap/shield.svg";
import UNSHIELDED from "~/statics/images/roadmap/un-shield.svg";

interface SuffixElementProps {
  color?: string;
  direction?: "left" | "right";
  length?: number; // chiều dài ngang (px)
  height?: number; // chiều cao đi lên (px)
  circleRadius?: number;
  strokeWidth?: number;
  curveRadius?: number; // độ cong góc
  className?: string;
}

const SuffixElement: React.FC<SuffixElementProps> = ({
  color = "#11C15B",
  direction = "right",
  length = 15,
  height = 100,
  circleRadius = 5,
  strokeWidth = 2,
  curveRadius = 15,
  className,
}) => {
  const gradientId = useId(); // unique ID cho mỗi instance

  const svgWidth = length + circleRadius * 2 + curveRadius;
  const svgHeight = height + circleRadius * 2 + curveRadius;
  const circleY = svgHeight - circleRadius - strokeWidth / 2;
  const circleX =
    direction === "right" ? circleRadius : svgWidth - circleRadius;

  const lineEndX = direction === "right" ? circleX + length : circleX - length;
  const lineY = circleY;

  // path: từ circle → ngang → cong → lên trên
  const pathD = `
    M ${circleX} ${circleY}
    L ${lineEndX} ${lineY}
    Q ${lineEndX} ${lineY} ${
    lineEndX + (direction === "right" ? curveRadius : -curveRadius)
  } ${lineY - curveRadius}
    V ${circleY - height}
  `;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={svgWidth}
      height={svgHeight}
      className={className}
    >
      {/* Circle đặc màu */}
      <circle cx={circleX} cy={circleY} r={circleRadius} fill={color} />

      {/* Gradient riêng cho stroke */}
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1={circleY}
          x2="0"
          y2={circleY - height}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ROADMAP = [
  {
    title: "Q4-2023",
    desc: [
      "Signature & Contract Management ",
      "Version Management & Tracking",
      "Real-time Notification",
      "Mobile app",
      "OneID Integration",
    ],
    shields: [SHIELD, SHIELD, SHIELD, SHIELD, SHIELD],
    placement: "left",
    className: "",
    icon: ICON1,
    color: "#0B7FC4",
    suffixClassName:
      "flex-row items-end right-0 top-1/2 -translate-y-1/2 translate-x-full",
    configs: { w: 15, h: 200 },
  },
  {
    title: "Q1-2024",
    desc: [
      "Ramper Support & eKYC Onboarding",
      "Fault Detection",
      "On-chain Payment with ZKP",
      "Comprehensive Features for Mobile App",
    ],
    shields: [UNSHIELDED, UNSHIELDED, UNSHIELDED, UNSHIELDED],
    placement: "right",
    className: "gradient-purple",
    icon: ICON2,
    color: "#943CCF",
    suffixClassName:
      "flex-row items-end left-0 top-1/2 -translate-y-1/2 -translate-x-full rotate-y-180",
    configs: { w: 15, h: 200 },
  },
  {
    title: "Q2-2024",
    desc: [
      "VicShield ver 2.0",
      "VicShield for Business",
      "Shield as a Service SDK",
      "Advanced Custom Branding",
      "In-app Chatting",
    ],
    shields: [UNSHIELDED, UNSHIELDED, UNSHIELDED, UNSHIELDED, UNSHIELDED],
    placement: "left",
    className: "gradient-red",
    icon: ICON3,
    color: "#C2615E",
    suffixClassName:
      "flex-row items-end right-0 top-1/2 -translate-y-1/2 translate-x-full",
    configs: { w: 25, h: 560 },
  },
  {
    title: "Q3-2024",
    desc: [
      "Shield as-a- Service Platform live",
      "Transaction Management",
      "AI & ML Integration",
      "Multiple Language Support",
      "Intel-driven Reporting",
      "Legacy & Compliance Template Localization",
    ],
    shields: [
      UNSHIELDED,
      UNSHIELDED,
      UNSHIELDED,
      UNSHIELDED,
      UNSHIELDED,
      UNSHIELDED,
    ],
    placement: "right",
    className: "gradient-orange",
    icon: ICON4,
    color: "#BE8434",
    suffixClassName:
      "flex-row items-end left-0 top-1/2 -translate-y-1/2 -translate-x-full rotate-y-180",
    configs: { w: 25, h: 560 },
  },
  {
    title: "Q4-2024",
    desc: [
      "Decentralized Storage Platform",
      "VicShield Network ",
      "Token Launching",
    ],
    shields: [UNSHIELDED, UNSHIELDED, UNSHIELDED],
    placement: "left",
    className: "gradient-green",
    icon: ICON1,
    color: "#11C15B",
    suffixClassName:
      "flex-row items-end right-0 top-1/2 -translate-y-1/2 translate-x-full",
    configs: { w: 35, h: 850 },
  },
];
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {ROADMAP.map((r) => {
            const { w, h } = r.configs;
            return (
              <Fragment>
                <div
                  className={`relative card-gradient col-span-full md:col-span-5 ${r.className}`}
                  key={r.title}
                >
                  <div className="card-gradient-body flex flex-col gap-4 md:gap-6 p-4 md:p-6">
                    <div className="flex flex-row items-center gap-4">
                      <img
                        className="w-10 h-auto object-contain"
                        src={r.icon}
                      />
                      <p className="text-sm md:text-base font-semibold">
                        {r.title}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {r.desc.map((d, i) => (
                        <div className="flex flex-row gap-4" key={d}>
                          <img
                            className="w-4 h-auto object-contain"
                            src={r.shields[i]}
                          />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`hidden md:flex absolute w-14 h-1/2  ${r.suffixClassName}`}
                  >
                    <SuffixElement color={r.color} length={w} height={h} />
                  </div>
                </div>
                {r.placement === "left" && (
                  <div className="hidden md:block col-span-2" />
                )}
              </Fragment>
            );
          })}
        </div>
      </section>
    </Container>
  );
};

export default Roadmap;
