import { API_URL } from "@/config/api";

export const sendConnectRequest = async (userId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/user/connect/sendconnectMail/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send connect request");
  }

  return response.json();
};
