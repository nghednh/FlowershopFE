import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAccount } from "../config/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("email")?.focus();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("❌ Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginAccount(email, password);
      console.log("Login response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Login successful!");

        // Navigate based on user role
        const userRole = data.user.role;
        if (userRole === "Admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setMessage(`❌ ${data.errors?.join(", ") || "Login failed"}`);
        setPassword("");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage(
        `❌ ${error.response?.data?.message || "Network error"
        }`
      );
      setPassword("");
    } finally {
      setLoading(false);
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Register
          </button>
        </p>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("❌")
                ? "text-red-600"
                : "text-yellow-600"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}