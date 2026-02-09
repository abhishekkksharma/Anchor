import React from "react";
import Navbar from "../components/header/navbar";
import { GridSmallBackground } from "../components/ui/grid-small-background";
import Hero  from "../components/about/Hero";
import Section2 from "@/components/about/Section2";

const About = () => {
  return (
    <>
      <GridSmallBackground>
        <Navbar />
        <div className="flex justify-center items-center mt-50">
          <Hero/>
        </div>
          <Section2/>
      </GridSmallBackground>
    </>
  );
};

export default About;

