import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import GlobalBackground from "@/components/GlobalBackground"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Creative Frontend Developer Portfolio",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white relative overflow-x-hidden`}
      >
        <GlobalBackground />
        <div className="relative z-10">{children}</div>
          <Toaster richColors={true} visibleToasts={1} />
        <Analytics />
      </body>
    </html>
  )
}
