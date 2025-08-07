import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAccount } from "../config/api";
import "./AuthPages.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("email")?.focus();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const data = await loginAccount(formData.email, formData.password);
      console.log("Login response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful! Redirecting...");

        // Navigate based on user role with a slight delay for better UX
        setTimeout(() => {
          const userRole = data.user.role;
          if (userRole === "Admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 500);
      } else {
        setMessage(data.errors?.join(", ") || "Login failed");
        setFormData(prev => ({ ...prev, password: "" }));
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "Network error occurred");
      setFormData(prev => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shape-1"></div>
        <div className="auth-shape-2"></div>
        <div className="auth-shape-3"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/flower.svg" alt="FlowerShop" className="auth-logo-icon" />
            <h1 className="auth-logo-text">FlowerShop</h1>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="input-group">
            <label htmlFor="email" className="auth-label">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                className={`auth-input ${formErrors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="input-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`auth-input ${formErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`auth-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="auth-link"
            >
              Sign up
            </button>
          </p>
        </div>

        {message && (
          <div className={`auth-message ${message.includes("successful") ? 'success' : 'error'}`}>
            <div className="message-icon">
              {message.includes("successful") ? "✓" : "⚠"}
            </div>
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}