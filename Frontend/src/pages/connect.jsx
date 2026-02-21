import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/header/navbar";
import { Map } from "@/components/ui/map";
import MapConnect from "@/components/Connect/MapConnect";
import UpdateLocation from "@/components/Connect/UpdateLocation";
import { API_URL } from "../config/api";

function connect() {
  const [hasLocation, setHasLocation] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user/userlocation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (
          data.location &&
          data.location.coordinates &&
          data.location.coordinates.length > 0
        ) {
          setHasLocation(true);
          setUserCoordinates(data.location.coordinates);
        } else {
          setHasLocation(false);
          setUserCoordinates(null);
        }
      } else {
        setHasLocation(false);
        setUserCoordinates(null);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setHasLocation(false);
      setUserCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Sidebar />

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              Loading...
            </div>
          ) : hasLocation && userCoordinates ? (
            <div className="relative w-full">
              {/* Left fade */}
              <div className="absolute inset-y-0 left-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-neutral-50 dark:from-black to-transparent" />
              {/* Right fade */}
              <div className="absolute inset-y-0 right-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-neutral-50 dark:from-black to-transparent" />
              {/* Top fade */}
              <div className="absolute inset-x-0 top-0 h-4 z-10 pointer-events-none bg-gradient-to-b from-neutral-50 dark:from-black to-transparent" />
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-4 z-10 pointer-events-none bg-gradient-to-t from-neutral-50 dark:from-black to-transparent" />
              <MapConnect userCoordinates={userCoordinates} />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <UpdateLocation onLocationUpdate={() => fetchLocation()} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default connect;
