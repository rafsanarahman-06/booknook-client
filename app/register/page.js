"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import { BookOpen, Eye, EyeOff, LoaderCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (form.password.length < 6) {
      return toast.error("Password must contain at least 6 characters.");
    }

    if (!/[A-Z]/.test(form.password)) {
      return toast.error("Password must contain an uppercase letter.");
    }

    if (!/[a-z]/.test(form.password)) {
      return toast.error("Password must contain a lowercase letter.");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
         image: form.photoURL,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Google sign-up failed. Please try again.");
    }
  }

  return (
    <section className="flex min-h-[85vh] items-center justify-center bg-[#F8F7F2] px-4 py-14">
      <Toaster position="top-center" />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2">
        {/* Left section */}
        <div className="hidden flex-col justify-center bg-[#E8EDE5] p-12 md:flex">
          <BookOpen size={48} className="mb-8 text-[#607D68]" />

          <h1 className="mb-5 text-4xl font-semibold leading-tight">
            Every reader deserves a place.
          </h1>

          <p className="leading-8 text-[#59665D]">
            Join BookNook and discover a welcoming space to explore,
            borrow, and enjoy wonderful books.
          </p>

          <div className="mt-10 border-t border-[#CCD8CB] pt-6 text-sm text-[#59665D]">
            A little corner for every reader.
          </div>
        </div>

        {/* Registration form */}
        <div className="p-7 sm:p-10 md:p-12">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#607D68]">
              Join our community
            </p>

            <h2 className="text-3xl font-semibold">Create an Account</h2>

            <p className="mt-2 text-sm text-gray-500">
              Start your reading journey with BookNook.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-[#607D68]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-[#607D68]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Profile Photo URL
              </label>

              <input
                type="url"
                name="photoURL"
                value={form.photoURL}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-[#607D68]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 outline-none transition focus:border-[#607D68]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                At least 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-[#607D68]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#607D68] py-3 font-semibold text-white transition hover:bg-[#4E6956] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google sign-in button */}
          <button
            onClick={handleGoogleSignUp}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-3 font-medium text-[#29332D] transition hover:bg-gray-50 hover:shadow-sm"
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

            <span>Continue with Google</span>
          </button>

          <p className="mt-7 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#607D68] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}