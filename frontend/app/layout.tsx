import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EventHub - Your Event Registration Platform",
  description: "Find and register for events near you",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Analytics />
        <main className="min-h-screen p-4 md:p-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

