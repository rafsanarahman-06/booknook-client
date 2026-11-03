"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  BookOpen,
  Upload,
  LoaderCircle,
  ArrowLeft,
  ImagePlus,
} from "lucide-react";

function AddBookForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((previous) => ({ ...previous, image: "" }));
  }

  async function uploadImage() {
    if (!imageFile) {
      return form.image;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Image upload failed. Please try again.");
    }

    return result.data.display_url;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to add a book.");
      return;
    }

    if (!imageFile && !form.image.trim()) {
      toast.error("Please upload a book cover.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = form.image.trim();

      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage();
        setUploading(false);
      }

      const bookData = {
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        image: imageUrl,
        description: form.description.trim(),
        addedByName: user.name || "BookNook Reader",
        addedByEmail: user.email,
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await axios.post(
        `${apiUrl}/books`,
        bookData
      );

      if (response.data.success) {
        toast.success("Your book has been added successfully!");

        setTimeout(() => {
          router.push("/my-books");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error("ADD BOOK ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add book."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-7 flex items-center gap-2 text-sm font-medium text-[#607D68] hover:text-[#34483B]"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <div className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EDE5] text-[#607D68]">
            <BookOpen size={28} />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#607D68]">
            Share a Good Read
          </p>

          <h1 className="font-serif text-4xl font-bold text-[#29332D]">
            Add a New Book
          </h1>

          <p className="mt-3 text-[#68776b]">
            Add a wonderful book to the BookNook library.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#e8e9e2] bg-white p-6 shadow-sm sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">

            {/* Book Title */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#29332D]">
                Book Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter the book title"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#607D68]"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#29332D]">
                Author Name *
              </label>

              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#607D68]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#29332D]">
                Category *
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#607D68]"
              >
                <option value="">Select category</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#29332D]">
                Book Cover Image *
              </label>

              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ccd8cb] bg-[#F8F7F2] p-5 text-center transition hover:border-[#607D68]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Book cover preview"
                    className="max-h-48 rounded-xl object-contain"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={38}
                      className="mb-3 text-[#607D68]"
                    />

                    <span className="font-semibold text-[#29332D]">
                      Click to upload book cover
                    </span>

                    <span className="mt-2 text-xs text-gray-500">
                      JPG, PNG or WEBP · Maximum 5 MB
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imageFile && (
                <p className="mt-2 text-xs text-[#607D68]">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#29332D]">
                Book Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description of the book..."
                rows={5}
                required
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#607D68]"
              />
            </div>

            {/* Added By Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#29332D]">
                Added By *
              </label>

              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none"
              />
            </div>

            {/* Added By Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#29332D]">
                User Email *
              </label>

              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-[#607D68] py-4 font-semibold text-white shadow-sm transition hover:bg-[#4E6956] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving || uploading ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                {uploading ? "Uploading Image..." : "Adding Book..."}
              </>
            ) : (
              <>
                <Upload size={19} />
                Add Book to Library
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Your book will be added to the BookNook collection.
          </p>
        </form>
      </div>
    </section>
  );
}

export default function AddBookPage() {
  return (
    <ProtectedRoute>
      <AddBookForm />
    </ProtectedRoute>
  );
}