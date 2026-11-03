"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

import {
  BookOpen,
  Eye,
  EyeOff,
  LoaderCircle,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Get the page the user originally wanted to visit.
  function getRedirectPath() {
    const params = new URLSearchParams(window.location.search);
    const callbackURL = params.get("callbackURL");

    // Only allow internal website paths.
    if (
      callbackURL &&
      callbackURL.startsWith("/") &&
      !callbackURL.startsWith("//")
    ) {
      return callbackURL;
    }

    return "/";
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Email and password login
  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const redirectTo = getRedirectPath();

      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: redirectTo,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back to BookNook!");

      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Google login
  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);

      const redirectTo = getRedirectPath();

      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  // Forgot password UI only (as required by the assignment)
  function handleForgotPassword() {
    toast("Password reset is not available yet.", {
      icon: "ℹ️",
    });
  }

  return (
    <section className="flex min-h-[85vh] items-center justify-center bg-[#F8F7F2] px-4 py-14">
      <Toaster position="top-center" />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2">

        {/* Left section */}
        <div className="hidden flex-col justify-center bg-[#E8EDE5] p-12 md:flex">
          <BookOpen size={48} className="mb-8 text-[#607D68]" />

          <h1 className="mb-5 text-4xl font-semibold leading-tight text-[#29332D]">
            Welcome back, reader.
          </h1>

          <p className="leading-8 text-[#59665D]">
            Your next favourite book might be waiting for you.
            Continue your reading journey with BookNook.
          </p>

          <div className="mt-10 border-t border-[#CCD8CB] pt-6 text-sm text-[#59665D]">
            A little corner for every reader.
          </div>
        </div>

        {/* Login form */}
        <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#607D68]">
              Welcome to BookNook
            </p>

            <h2 className="text-3xl font-semibold text-[#29332D]">
              Login to Your Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your details to continue reading.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#29332D]">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-[#607D68]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#29332D]">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 outline-none transition focus:border-[#607D68]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-[#607D68] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#607D68] py-3 font-semibold text-white transition hover:bg-[#4E6956] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-3 font-medium text-[#29332D] transition hover:bg-gray-50 hover:shadow-sm disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />

              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.12 7.14-10.2 7.14-17.56z"
              />

              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19z"
              />

              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.84 2.26-8.28 2.26-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>

            <span>
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          {/* Register link */}
          <p className="mt-7 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#607D68] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}