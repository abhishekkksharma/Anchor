import React from "react";

function ComingSoon(props) {
  return (
    <div className="flex justify-center items-center flex-col text-center">
      <p className="dark:text-white text-xl">{props.message}</p>
      <h1 className="font-extrabold text-zinc-300 text-6xl tracking-wider dark:text-white">
        Coming soon!
      </h1>
    </div>
  );
}

export default ComingSoon;