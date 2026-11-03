"use client";

import { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { authClient, useSession } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import {
  BookOpen,
  Mail,
  User,
  ArrowLeft,
  Library,
  PlusCircle,
  BookMarked,
  Camera,
} from "lucide-react";

function MyProfileContent() {
  const { data: session } = useSession();
  const user = session?.user;

  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  async function handlePhotoUpdate() {
    if (!photoURL.trim().startsWith("https://")) {
      toast.error("Please enter a valid HTTPS photo URL.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await authClient.updateUser({
        image: photoURL.trim(),
      });

      if (error) {
        toast.error(error.message || "Could not update profile photo.");
        return;
      }

      toast.success("Profile photo updated successfully!");

      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#607D68] hover:text-[#34483B]"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#E5E8DF] bg-white shadow-sm">
          <div className="bg-[#E8EDE5] px-6 py-10 text-center sm:px-10">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="mx-auto h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#607D68] text-3xl font-semibold text-white shadow-sm">
                {initial}
              </div>
            )}

            <h1 className="mt-5 font-serif text-3xl font-bold text-[#29332D]">
              {user?.name || "Reader"}
            </h1>

            <p className="mt-2 text-sm text-[#59665D]">
              Welcome to your BookNook profile
            </p>

            <div className="mx-auto mt-6 flex max-w-md flex-col gap-3">
              <label className="text-left text-sm font-semibold text-[#29332D]">
                <Camera className="mr-2 inline" size={17} />
                Update Profile Photo
              </label>

              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="Paste your profile photo URL"
                className="w-full rounded-lg border border-[#CCD8CB] bg-white px-4 py-3 text-sm text-[#29332D] outline-none focus:border-[#607D68]"
              />

              <button
                type="button"
                onClick={handlePhotoUpdate}
                disabled={saving || !photoURL.trim()}
                className="rounded-lg bg-[#607D68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4E6956] disabled:opacity-50"
              >
                {saving ? "Saving Photo..." : "Update Profile Photo"}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="mb-6 font-serif text-2xl font-bold text-[#29332D]">
              Personal Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F8F7F2] p-5">
                <div className="mb-3 flex items-center gap-2 text-[#607D68]">
                  <User size={19} />
                  <span className="text-sm font-semibold">Full Name</span>
                </div>
                <p className="break-words font-medium text-[#29332D]">
                  {user?.name || "Not available"}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F7F2] p-5">
                <div className="mb-3 flex items-center gap-2 text-[#607D68]">
                  <Mail size={19} />
                  <span className="text-sm font-semibold">Email Address</span>
                </div>
                <p className="break-all font-medium text-[#29332D]">
                  {user?.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="mb-5 font-serif text-2xl font-bold text-[#29332D]">
                Your BookNook
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <Link
                  href="/my-books"
                  className="group rounded-xl border border-[#E5E8DF] p-5 transition hover:border-[#607D68] hover:bg-[#F8F7F2]"
                >
                  <Library className="mb-3 text-[#607D68]" size={25} />
                  <h3 className="font-semibold text-[#29332D]">My Books</h3>
                  <p className="mt-1 text-sm text-[#59665D]">
                    Manage your added books
                  </p>
                </Link>

                <Link
                  href="/my-borrows"
                  className="group rounded-xl border border-[#E5E8DF] p-5 transition hover:border-[#607D68] hover:bg-[#F8F7F2]"
                >
                  <BookMarked className="mb-3 text-[#607D68]" size={25} />
                  <h3 className="font-semibold text-[#29332D]">
                    My Borrows
                  </h3>
                  <p className="mt-1 text-sm text-[#59665D]">
                    View your borrowed books
                  </p>
                </Link>

                <Link
                  href="/add-book"
                  className="group rounded-xl border border-[#E5E8DF] p-5 transition hover:border-[#607D68] hover:bg-[#F8F7F2]"
                >
                  <PlusCircle className="mb-3 text-[#607D68]" size={25} />
                  <h3 className="font-semibold text-[#29332D]">
                    Add a Book
                  </h3>
                  <p className="mt-1 text-sm text-[#59665D]">
                    Share a book with readers
                  </p>
                </Link>
              </div>
            </div>

            <div className="mt-10 rounded-xl bg-[#E8EDE5] p-6 text-center">
              <BookOpen className="mx-auto mb-3 text-[#607D68]" size={30} />
              <h3 className="font-serif text-xl font-bold text-[#29332D]">
                Every Reader Belongs Here
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#59665D]">
                A welcoming space to discover, borrow and enjoy wonderful
                books. Every reader belongs here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  return (
    <ProtectedRoute>
      <MyProfileContent />
    </ProtectedRoute>
  );
}