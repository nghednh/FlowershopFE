import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.ts";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null); // 👈

  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("firstName")?.focus();
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          navigate("/login");
          return null;
        }
        return prev! - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const {
      firstName,
      lastName,
      email,
      userName,
      phoneNumber,
      password,
      confirmPassword,
    } = form;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !userName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success !== false) {
        setMessage("✅ Registration successful! Redirecting in 3...");
        setCountdown(3); // ⏱️ Start countdown
      } else {
        setMessage(`❌ Registration failed. ${data.errors?.join(", ")}.`);
      }
    } catch (error) {
      setMessage("⚠️ Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className="w-full mb-2 p-2 border rounded"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            className="w-full mb-2 p-2 border rounded"
            value={form.lastName}
            onChange={handleChange}
          />
          <input
            name="userName"
            placeholder="Username"
            className="w-full mb-2 p-2 border rounded"
            value={form.userName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-2 p-2 border rounded"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number (optional)"
            className="w-full mb-2 p-2 border rounded"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-2 p-2 border rounded"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full mb-4 p-2 border rounded"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("❌")
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {countdown !== null && countdown > 0
              ? `✅ Registration successful! Redirecting in ${countdown}...`
              : message}
          </p>
        )}
      </div>
    </div>
  );
}
