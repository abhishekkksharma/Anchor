import React from "react";
import Navbar from "../components/navbar";
import { GridSmallBackground } from "../components/ui/grid-small-background";
import Hero  from "@/components/about/Hero";

const About = () => {
  return (
    <>
      <GridSmallBackground>
        <Navbar />
        <div className="flex justify-center items-center mt-50">
          <Hero/>
        </div>
      </GridSmallBackground>
    </>
  );
};

export default About;

