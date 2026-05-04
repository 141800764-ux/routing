"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Home Page</h1>

      <Link href="/projects/list">See Projects</Link>

      <div style={{ marginTop: "20px" }}>
        <DropdownMenu>

          <DropdownMenuTrigger asChild>
            <button className="px-4 py-2 bg-black text-white rounded">
              Open Menu
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>My Account</DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      </div>
    </main>
  )
}