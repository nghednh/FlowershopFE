import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAccount } from "../config/api";
import { APP_ICON } from "../config";
import "./AuthPages.css";

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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.userName.trim()) errors.userName = "Username is required";
    else if (form.userName.length < 3) errors.userName = "Username must be at least 3 characters";
    
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const data = await registerAccount(
        form.firstName,
        form.lastName,
        form.email,
        form.userName,
        form.phoneNumber,
        form.password,
        form.confirmPassword
      );
      
      console.log("Register response:", data);
      
      if (data.success !== false) {
        setMessage("Registration successful! Redirecting to login...");
        setCountdown(3);
      } else {
        setMessage(`${data.errors?.join(", ") || "Register failed"}`);
      }
    } catch (error) {
      setMessage("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container register">
      <div className="auth-background">
        <div className="auth-shape-1"></div>
        <div className="auth-shape-2"></div>
        <div className="auth-shape-3"></div>
      </div>
      
      <div className="auth-card wide">
        <div className="auth-header">
          <div className="auth-logo">
            <img src={APP_ICON} alt="FlowerShop" className="auth-logo-icon" />
            <h1 className="auth-logo-text">FlowerShop</h1>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us and discover beautiful flowers</p>
        </div>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          {/* Personal Information */}
          <div className="form-row">
            <div className="input-group half">
              <label htmlFor="firstName" className="auth-label">First Name</label>
              <div className="input-wrapper">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className={`auth-input ${formErrors.firstName ? 'error' : ''}`}
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
            </div>
            
            <div className="input-group half">
              <label htmlFor="lastName" className="auth-label">Last Name</label>
              <div className="input-wrapper">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className={`auth-input ${formErrors.lastName ? 'error' : ''}`}
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
              {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="userName" className="auth-label">Username</label>
            <div className="input-wrapper">
              <input
                name="userName"
                type="text"
                placeholder="Choose a username"
                className={`auth-input ${formErrors.userName ? 'error' : ''}`}
                value={form.userName}
                onChange={handleChange}
              />
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {formErrors.userName && <span className="error-message">{formErrors.userName}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="email" className="auth-label">Email Address</label>
            <div className="input-wrapper">
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                className={`auth-input ${formErrors.email ? 'error' : ''}`}
                value={form.email}
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
            <label htmlFor="phoneNumber" className="auth-label">Phone Number (Optional)</label>
            <div className="input-wrapper">
              <input
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                className="auth-input"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="form-row">
            <div className="input-group half">
              <label htmlFor="password" className="auth-label">Password</label>
              <div className="input-wrapper">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`auth-input ${formErrors.password ? 'error' : ''}`}
                  value={form.password}
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

            <div className="input-group half">
              <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`auth-input ${formErrors.confirmPassword ? 'error' : ''}`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`auth-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="auth-link"
            >
              Sign in
            </button>
          </p>
        </div>

        {message && (
          <div className={`auth-message ${message.includes("successful") ? 'success' : 'error'}`}>
            <div className="message-icon">
              {message.includes("successful") ? "✓" : "⚠"}
            </div>
            <span>
              {countdown !== null && countdown > 0
                ? `Registration successful! Redirecting in ${countdown}...`
                : message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
