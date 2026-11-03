"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";

import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Get the current BetterAuth session
  const { data: session, isPending } = useSession();

  const isLoggedIn = !!session?.user;
  const user = session?.user;

  const profileImage = user?.image || user?.photoURL;
  const userName = user?.name || "Reader";

  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
  ];

  const privateLinks = [
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  const links = isLoggedIn
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  const handleLogout = async () => {
    try {
      await signOut();
      setProfileOpen(false);
      setMenuOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce3d9] bg-[#E8EDE5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#607D68] text-white">
            <BookOpen size={24} />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#29332D]">
              BookNook
            </h1>
            <p className="text-xs tracking-wide text-[#68776b]">
              A little corner for every reader
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#34483B] transition-colors hover:text-[#607D68]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/70" />
          ) : !isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#34483B] transition hover:bg-white/70"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-[#607D68] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4e6855]"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#34483B] transition hover:bg-white/70"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName}
                    className="h-9 w-9 rounded-full border border-[#cbd6c9] object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#607D68] text-white">
                    <UserRound size={19} />
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-[#e5e9e2] bg-white p-2 shadow-lg">
                  <div className="border-b border-[#edf0eb] px-3 py-3">
                    <p className="font-semibold text-[#29332D]">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    href="/my-profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-[#34483B] transition hover:bg-[#F8F7F2]"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#34483B] transition hover:bg-white/70 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#dce3d9] bg-[#E8EDE5] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#34483B] transition hover:bg-white/70"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {!isPending && (
            <>
              {!isLoggedIn ? (
                <div className="mt-4 flex gap-3 border-t border-[#dce3d9] pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-lg border border-[#607D68] py-2.5 text-center text-sm font-semibold text-[#34483B]"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-lg bg-[#607D68] py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="mt-4 border-t border-[#dce3d9] pt-4">
                  <div className="mb-3 flex items-center gap-3 px-3">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={userName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#607D68] text-white">
                        <UserRound size={20} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29332D]">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/my-profile"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm text-[#34483B] hover:bg-white/70"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}