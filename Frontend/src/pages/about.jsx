import React from "react";
import Navbar from "../components/navbar";

const About = () => {
  return (
    <>
    <div className="">
      <Navbar />
      <div className="flex items-center justify-center bg-white dark:bg-black h-screen">
        <h1 className="text-3xl font-bold">About</h1>
      </div>
    </div>
    </>
  );
};

export default About;
