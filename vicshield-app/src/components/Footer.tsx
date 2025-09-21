import Container from "./UI/Container";

import GITHUB from "~/statics/images/footer/github.svg";
import DISCORD from "~/statics/images/footer/discord.svg";
import X from "~/statics/images/footer/x.svg";
import YT from "~/statics/images/footer/youtube.svg";
import REDIT from "~/statics/images/footer/redit.svg";
import LINKED from "~/statics/images/footer/linkedin.svg";

const Footer: React.FC = () => {
  return (
    <Container>
      <div className="flex flex-col gap-6 md:gap-8 bg-base-300  p-6 md:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <img className="w-14 h-auto object-contain" src="/logo.png" />
            <p className="text-base md:text-xl font-bold">VicShield</p>
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <p>Built for the future. Available today.</p>
            <button className="btn btn-primary w-fit bg-lg">
              get early access
            </button>
          </div>
        </div>
        <div className="divider" />
        <footer className="grid grid-cols-1 md:grid-cols-3 items-start">
          <ul className="flex flex-col gap-1">
            <p className="text-secondary">Products</p>
            <li>Notification</li>
            <li>OneID</li>
            <li>Priority Labeling</li>
            <li>Status update</li>
            <li>Sub-Signatures</li>
          </ul>
          <ul className="flex flex-col gap-1">
            <p className="text-secondary">More</p>
            <li>Blog</li>
            <li>Documentation</li>
            <li>Help Center</li>
            <li>FAQs</li>
          </ul>
          <div className="w-full flex flex-row justify-start md:justify-end">
            <div className="w-full md:w-fit flex flex-row gap-4 p-4 bg-[#38384D] rounded-4xl">
              {[GITHUB, X, DISCORD, YT, REDIT, LINKED].map((i) => (
                <img
                  className="w-6 h-auto object-contain cursor-pointer active:scale-95 transition-all"
                  src={i}
                />
              ))}
            </div>
          </div>
          <div className="col-span-full">
            <p>© {new Date().getFullYear()} VicShield. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Container>
  );
};

export default Footer;
