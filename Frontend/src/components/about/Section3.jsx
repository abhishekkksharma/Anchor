import React from "react";
import Phone from "../../assets/Phone.png";
import {
  apple,
  chatGpt,
  claude,
  deepseak,
  google,
  meta,
} from "../../assets/techlogos";

function Section3() {
  // Mark which logos should invert in dark mode
  const logos = [
    { src: apple, invertDark: true },
    { src: chatGpt, invertDark: true },
    { src: claude, invertDark: false },
    { src: deepseak, invertDark: false },
    { src: google, invertDark: false },
    { src: meta, invertDark: false },
  ];

  // Duplicate enough times to cover any screen
  const extendedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="flex flex-col items-center overflow-hidden lg:mt-80 my-20">
      {/* MARQUEE */}
      <div className="marquee mt-30">
        <div className="marquee-track">
          {extendedLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt="tech-logo"
              className={`logo ${logo.invertDark ? "dark:invert" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* PHONE */}
      <img
        src={Phone}
        className="h-60 lg:h-80 object-contain -mt-35 z-20"
        alt="Phone"
      />
      <div className="flex dark:text-white items-center justify-center max-w-200 ">
        <p className="text-center text-xl p-8 font-semibold -mt-8 opacity-80">
          Discover what’s happening in tech — what’s new, what’s trending, and
          how the world is evolving every day. At Anchor, we believe technology
          isn’t something to hoard or gatekeep. It’s a tool meant to be shared,
          used thoughtfully, and leveraged to improve people’s lives. After all,
          isn’t our ability to create, collaborate, and uplift others what truly
          makes us human?
        </p>
      </div>

      <style>{`
        .marquee {
          width: 100%;
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          animation: scroll 25s linear infinite;
        }

        .logo {
          height: 50px;
          margin: 0 70px;
          flex-shrink: 0;
          opacity: 0.7;
          transition: 0.3s;
        }

        .logo:hover {
          opacity: 1;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-25%);
          }
        }
      `}</style>
    </div>
  );
}

export default Section3;
