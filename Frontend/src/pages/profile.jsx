import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { API_URL } from "../config/api";
import ProfileTop from "@/components/profile/profileTop";


function Profile() {
  const { username } = useParams();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black pt-15">
      <ProfileTop username={username} />
    </div>
  );
}

export default Profile;
