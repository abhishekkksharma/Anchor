import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { API_URL } from "../config/api";
import ProfileTop from "@/components/profile/profileTop";


function Profile() {

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black pt-10">
      <ProfileTop/>
    </div>
  );
}

export default Profile;
