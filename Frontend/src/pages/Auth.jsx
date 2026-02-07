import React, { useState } from "react";
import { GridSmallBackground } from "../components/ui/grid-small-background";
import Navbar from "@/components/navbar";


const API_BASE = "http://localhost:5000/user";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "login" : "signup";

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage(data.message || `${isLogin ? "Login" : "Signup"} successful!`);

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <GridSmallBackground>
        <Navbar/>
      <div className="w-full max-w-sm mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
        <h2 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {message && (
          <p className="mb-3 text-center text-sm text-red-500">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            required
          />

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-black dark:text-white">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="text-blue-600 underline"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </GridSmallBackground>
  );
}
