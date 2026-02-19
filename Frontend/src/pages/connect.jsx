import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/header/navbar";
import { Map } from "@/components/ui/map";
import MapConnect from "@/components/Connect/MapConnect"
import UpdateLocation from "@/components/Connect/UpdateLocation";

function connect() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />
      <Sidebar />

      {/* Main content — centered on screen */}
      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          <h1>Connect</h1>
          <MapConnect />
          <div className="flex items-center justify-center">
          <UpdateLocation/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default connect;
