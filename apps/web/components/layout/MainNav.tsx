"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Strona główna" },
  { href: "/o-nas", label: "O nas" },
  { href: "/cennik", label: "Cennik" },
  { href: "/kontakt", label: "Kontakt" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-white bg-[#297FFF] backdrop-blur fixed w-full z-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / nazwa */}
        <Link href="/" className="text-lg font-bold">
          siedlisko
          {/* <img src="/images/logo.png" alt="siedlisko logo" /> */}
        </Link>

        {/* Linki */}
        <nav className="flex gap-4">
          {links.map(link => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "text-lg font-semibold transition-all duration-200 hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] " +
                  (isActive
                    ? "text-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "text-white")
                }
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
