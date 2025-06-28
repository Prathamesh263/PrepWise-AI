// components/auth/SignOutButton.tsx
"use client";

import { GradientButton } from "@/components/ui/gradient-button";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.refresh();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <GradientButton
          onClick={handleSignOut}
          disabled={isLoading}
          variant="signout"
          className={isLoading ? "opacity-75 cursor-not-allowed" : ""}
      >
        {isLoading ? "Signing out..." : "Sign Out"}
      </GradientButton>
  );
}