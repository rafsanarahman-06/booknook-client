"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      const currentPath = window.location.pathname;
      const callbackURL = encodeURIComponent(currentPath);

      router.replace(`/login?callbackURL=${callbackURL}`);
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F7F2]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={36}
            className="animate-spin text-[#607D68]"
          />
          <p className="text-sm text-[#59665D]">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  return children;
}