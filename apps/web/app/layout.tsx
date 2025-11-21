import { Geist_Mono,Plus_Jakarta_Sans } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { MainNav } from "@/components/layout/MainNav"

export const metadata: Metadata = {
  title: "siedlisko",
  description: "Platforma dla hurtowni i sprzedawców",
};

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <MainNav />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
