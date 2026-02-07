import React from "react";
import Navbar from "../components/navbar";
import { GridSmallBackground } from "../components/ui/grid-small-background";

const About = () => {
  return (
    <>
      <GridSmallBackground>
        <Navbar />
        <div className="relative z-20 flex items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-black dark:text-white">About</h1>
        </div>
      </GridSmallBackground>
    </>
  );
};

export default About;

