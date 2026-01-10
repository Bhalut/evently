"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import styles from "./register.module.css";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", formData);

      // Auto login after registration
      const loginResponse = await api.post<{ access_token: string }>(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (loginResponse?.access_token) {
        localStorage.setItem("token", loginResponse.access_token);
        router.push("/events");
      } else {
        router.push("/login");
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const apiError = err as ApiError;
      const message =
        typeof apiError === "string"
          ? apiError
          : Array.isArray(apiError.message)
            ? apiError.message[0]
            : apiError.message;

      setGeneralError(message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Evently to manage your events</p>
        </div>

        {generalError && <div className={styles.error}>{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              disabled={isLoading}
            />
            {errors.name && (
              <div className={styles.fieldError}>{errors.name}</div>
            )}
          </div>

          <div className="form-control">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="name@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <div className={styles.fieldError}>{errors.email}</div>
            )}
          </div>

          <div className="form-control">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <div className={styles.fieldError}>{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
