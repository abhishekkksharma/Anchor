import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ComingSoon from "@/components/ComingSoon";
import SettingsOptions from "@/components/settings/options";
import UpdateLocation from "@/components/Connect/UpdateLocation";
import EditProfileModal from "@/components/profile/EditProfileModal";

function Settings() {
  const { tab } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const renderContent = () => {
    const currentTab = tab || "update-account-data";

    switch (currentTab.toLowerCase()) {
      case "update-location":
        return <UpdateLocation />;

      case "update-account-data":
        return <EditProfileModal inline={true} />;

      case "story":
        return <ComingSoon message="Story Settings" />;

      case "people":
        return <ComingSoon message="People Settings" />;

      case "newsroom":
        return <ComingSoon message="Newsroom Settings" />;

      default:
        return (
          <ComingSoon
            message={`${currentTab.replace("-", " ")} Settings`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black relative">
      <SettingsOptions />

      <main className="min-h-screen md:pt-20 pb-20 px-4">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6 mt-6 md:mt-0 lg:mt-6">
          
          <div className=" min-h-[60vh] p-6 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md">
                {renderContent()}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Settings;

