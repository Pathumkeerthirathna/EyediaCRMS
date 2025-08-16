import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

export default function Login(){

  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setLoading(true);

    try {

      console.log(BASE_URL);

      const res = await fetch("/api/User/Authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNameOrEmail: form.username,
          password: form.password,
        }),
      });

      console.log(res);

      const data = await res.json();

      if (res.ok) {
        // Example: store token in localStorage
        localStorage.setItem("token", data.token);
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Eyedia CRM</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}