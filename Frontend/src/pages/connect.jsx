import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/header/navbar";
import { Map } from "@/components/ui/map";
import MapConnect from "@/components/Connect/MapConnect"
import UpdateLocation from "@/components/Connect/UpdateLocation";
import { API_URL } from "../config/api";

function connect() {
  const [hasLocation, setHasLocation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/user/userlocation`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.location && data.location.coordinates && data.location.coordinates.length > 0) {
            setHasLocation(true);
          } else {
            setHasLocation(false);
          }
        } else {
          setHasLocation(false);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setHasLocation(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />
      <Sidebar />

      {/* Main content — centered on screen */}
      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          {/* <div className="flex justify-center items-center">
          <h1 className="font-semibold text-2xl">Connect to people around you</h1>
          </div> */}
          {loading ? (
            <div className="flex justify-center items-center h-40">Loading...</div>
          ) : hasLocation ? (
            <MapConnect />
          ) : (
            <div className="flex items-center justify-center">
              <UpdateLocation onLocationUpdate={() => setHasLocation(true)} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default connect;
