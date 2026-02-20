import React, { useState, useEffect } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
} from "@/components/ui/map";
import { Avatar1, Avatar2, Avatar3, Avatar4, Avatar5 } from '../../assets/Avatars/index';
import { API_URL } from "../../config/api";
import { MapPin } from "lucide-react";

const theme = localStorage.getItem("theme");

function MapConnect({ userCoordinates }) {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        if (!userCoordinates) return;
        setLoading(true);
        const token = localStorage.getItem("token");
        // userCoordinates is [lng, lat]
        const [lng, lat] = userCoordinates;
        const res = await fetch(`${API_URL}/user/connect/nearby?lat=${lat}&lng=${lng}&rangeKm=50`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setNearbyUsers(data.users || []);
        } else {
          console.error("Failed to fetch nearby users");
        }
      } catch (error) {
        console.error("Error fetching nearby users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyUsers();
  }, [userCoordinates]);

  // If no userCoordinates, we can just return null or a message, but parent component ensures it's present.
  if (!userCoordinates) return null;

  return (
    <div className="h-96 w-full">
      <Map center={[userCoordinates[1], userCoordinates[0]]} zoom={9}>
        {nearbyUsers.map((user, index) => {
          // Check if user has the default mongoose avatar or no avatar
          const isDefaultAvatar = !user.avatar || user.avatar.includes("ui-avatars.com");
          const localAvatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
          const assignedAvatar = isDefaultAvatar ? localAvatars[index % localAvatars.length] : user.avatar;

          return (
            <MapMarker
              key={user._id}
              longitude={user.location.coordinates[1]}
              latitude={user.location.coordinates[0]}
            >
              <MarkerContent>
                <div className="relative group cursor-pointer hover:scale-110 transition-transform duration-200">
                  {/* Ping animation behind avatar */}
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping group-hover:animate-none" />

                  {/* Avatar container */}
                  <div className="relative size-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center">
                    <img
                      src={assignedAvatar}
                      alt={user.name || "User Avatar"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Safe fallback if local image fails
                        e.target.src = localAvatars[index % localAvatars.length];
                      }}
                    />
                  </div>
                </div>
              </MarkerContent>

              <MarkerTooltip>{user.name || user.username}</MarkerTooltip>

              <MarkerPopup>
                <div className="p-1 min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={assignedAvatar}
                      alt={user.name || "User"}
                      className="size-12 rounded-full border shadow-sm object-cover"
                      onError={(e) => { e.target.src = localAvatars[index % localAvatars.length]; }}
                    />
                    <div className="text-center">
                      <p className="font-semibold text-sm leading-tight text-neutral-900 dark:text-neutral-100">{user.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">@{user.username}</p>
                    </div>

                    {user.location.placeName && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                        <MapPin className="size-3" />
                        <span className="truncate max-w-[120px]">{user.location.placeName || user.location.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}
        <MapControls className="h-50 w-8"
          position="bottom-right"
          showZoom
          showCompass
          showFullscreen
        />

        {/* special marker for the current user */}
        <MapMarker
          longitude={userCoordinates[1]}
          latitude={userCoordinates[0]}
        >
          <MarkerContent>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" />
              <div className="relative flex items-center justify-center size-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 border-2 border-white shadow-xl hover:scale-110 transition-transform duration-200">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </MarkerContent>
          <MarkerTooltip>You are here</MarkerTooltip>
          <MarkerPopup>
            <div className="space-y-1">
              <p className="font-medium">You</p>
            </div>
          </MarkerPopup>
        </MapMarker>
      </Map>
    </div>
  );
}

export default MapConnect;
