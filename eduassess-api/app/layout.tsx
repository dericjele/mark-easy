import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "EduAssess AI - Smart Assignment Assessment",
    description: "AI-powered assignment assessment tool for educators and students",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">EA</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">EduAssess AI</h1>
                        <p className="text-sm text-gray-600">Smart Assignment Assessment</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <a href="/" className="text-gray-600 hover:text-gray-900">
                        Home
                    </a>
                    <a href="/test" className="text-gray-600 hover:text-gray-900">
                        API Test
                    </a>
                    <a href="/test-rubrics" className="text-blue-600 font-medium">
                        Rubric Test
                    </a>
                    <a href="/test-winston" className="text-green-600 font-medium">
                        Winston Test
                    </a>
                </div>
            </div>
        </nav>
        {children}
        </body>
        </html>
    )
}
