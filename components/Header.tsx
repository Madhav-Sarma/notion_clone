'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs"
import BreadCrumbs from "./BreadCrumbs";

function Header() {
    const { user } = useUser();
  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <h1 className="text-2xl">{user?.firstName}{`'s`} workspace</h1>
      )}

      {/* BreadCrumbs */}
      <BreadCrumbs />
      
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Header