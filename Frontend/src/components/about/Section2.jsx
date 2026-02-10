import Video from "../../assets/loader.mp4";

function Section2() {
  return (
    <>
      <div className="flex justify-between font-sans items-center mt-95 bg-white py-20 mb-20">
        
        {/* Left Side - Video */}
        <div className="w-1/2 flex justify-center items-center">
          <video
            src={Video}
            autoPlay
            muted
            playsInline
            loop
            className="h-100 pl-20"
          ></video>
        </div>

        {/* Right Side - Styled Text */}
        <div className="w-1/2 pr-20 text-xl text-center font-semibold leading-relaxed">

          <p>
            Anchor is a{" "}
            <span className="bg-purple-200 px-2 py-1 rounded-xl">
              Dev Community
            </span>{" "}
            platform made for{" "}
            <span className="bg-orange-200 px-2 py-1 rounded-xl">
              techies
            </span>
            .
          </p>

          <p className="mt-4">
            We believe tech should be{" "}
            <span className="bg-green-200 px-2 py-1 rounded-xl">
              fun & collaborative
            </span>{" "}
            and help others build as well.
          </p>

          <p className="mt-4">
            We offer a platform to{" "}
            <span className="bg-yellow-200 px-2 py-1 rounded-xl">
              connect, collaborate
            </span>{" "}
            and{" "}
            <span className="bg-blue-200 px-2 py-1 rounded-xl">
              learn with ease
            </span>
            .
          </p>

        </div>

      </div>
    </>
  );
}

export default Section2;
