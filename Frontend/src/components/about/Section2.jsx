import Video from "../../assets/loader.mp4";

function Section2() {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center font-sans bg-white dark:bg-transparent py-16 lg:py-2 px-6 lg:px-20 gap-12">
      {/* Left Side - Video */}
      <div className="w-1/2 lg:w-1/4 flex justify-center items-center">
        <video
          src={Video}
          autoPlay
          muted
          playsInline
          loop
          className="w-full dark:invert max-w-md lg:max-w-lg object-contain"
        />
      </div>

      {/* Right Side - Text */}
      <div className="w-full lg:w-1/2 font-sans text-center lg:text-left text-lg bg-amber-50 sm:text-xl lg:text-xl p-4 font-semibold leading-relaxed space-y-6">
        <p className="text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto font-inter text-black text-justify">
          Anchor is a developer community platform built to foster meaningful
          collaboration, continuous learning, and open-source innovation. We
          believe great ideas grow stronger when shared, and that no developer
          should have to solve problems alone. Whether you're debugging a
          stubborn 2AM error, preparing for your next hackathon, exploring a new
          framework, or contributing to open source, Anchor connects you with
          peers who are ready to build, learn, and grow alongside you. Our
          mission is simple: create a trusted space where developers can
          exchange knowledge, find teammates, solve real-world problems, and
          turn ambitious ideas into impactful projects — together.
        </p>
      </div>
    </div>
  );
}

export default Section2;

