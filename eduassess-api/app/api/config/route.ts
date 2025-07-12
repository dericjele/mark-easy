import { NextResponse } from "next/server"

// CORS headers for Chrome extension
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    })
}

// API endpoint to check configuration status
export async function GET() {
    const isConfigured = {
        grokApiKey: !!process.env.GROK_API_KEY,
        grokApiUrl: !!process.env.GROK_API_URL,
        environment: process.env.NODE_ENV || "development",
    }

    return NextResponse.json(
        {
            configured: isConfigured.grokApiKey,
            details: isConfigured,
        },
        {
            headers: corsHeaders,
        },
    )
}
