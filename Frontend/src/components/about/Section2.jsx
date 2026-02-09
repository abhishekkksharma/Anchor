import Video from "../../assets/loader.mp4";
function Section2() {
  return (
    <>
      <div className="flex items-center mt-95 bg-white py-20">
        <div className="flex">
          <video
            src={Video}
            autoPlay
            muted
            playsInline
            loop
            className="flex h-100 pl-20"
          ></video>
        </div>
        <div>
            <p></p>
        </div>
      </div>
    </>
  );
}

export default Section2;
