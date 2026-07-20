"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import "./auth.css";
import { TextInput, TextInputPassword } from "@/components/ui/forms";
import { withAuthRedirect } from "./withAuthRedirect";

function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (response.data.success) {
        await login(
          response.data.data,
          response.data.accessToken,
          response.data.expiresIn,
        );

        await new Promise((resolve) => setTimeout(resolve, 100));

        try {
          const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
          if (redirectUrl) {
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectUrl);
          } else {
            router.push("/cms/books");
          }
        } catch (navError) {
          // Navigation errors (e.g. "Navigation cancelled") are safe to ignore
          // withAuthRedirect will handle the redirect when user state updates
          console.warn("Navigation warning (safe to ignore):", navError);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);

      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signin-form">
          <TextInput
            title={`Email`}
            required={true}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <TextInputPassword
            required={true}
            title={"Password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="signin-footer">
          <p>
            Do not have an account?{" "}
            <Link href="/sign-up" className="signup-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAuthRedirect(SignInPage);
