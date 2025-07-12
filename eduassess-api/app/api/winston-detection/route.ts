import { type NextRequest, NextResponse } from "next/server"

// CORS headers for Chrome extension
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle preflight requests
export async function OPTIONS() {
    return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json()

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "No text provided for analysis" }, { status: 400, headers: corsHeaders })
        }

        const winstonApiKey = process.env.WINSTON_API_KEY
        if (!winstonApiKey) {
            return NextResponse.json({ error: "Winston API key not configured" }, { status: 500, headers: corsHeaders })
        }

        // Run both AI detection and plagiarism detection in parallel
        const [aiDetectionResult, plagiarismResult] = await Promise.allSettled([
            performAIDetection(text, winstonApiKey),
            performPlagiarismDetection(text, winstonApiKey),
        ])

        // Process AI detection results
        const aiDetection =
            aiDetectionResult.status === "fulfilled"
                ? aiDetectionResult.value
                : {
                    error: aiDetectionResult.reason instanceof Error ? aiDetectionResult.reason.message : "AI detection failed",
                }

        // Process plagiarism detection results
        const plagiarismCheck =
            plagiarismResult.status === "fulfilled"
                ? plagiarismResult.value
                : {
                    error:
                        plagiarismResult.reason instanceof Error ? plagiarismResult.reason.message : "Plagiarism check failed",
                }

        return NextResponse.json(
            {
                ai_detection: aiDetection,
                plagiarism_check: plagiarismCheck,
                provider: "winston_ai",
                scan_time: new Date().toISOString(),
                text_length: text.length,
                word_count: text.split(" ").length,
            },
            { headers: corsHeaders },
        )
    } catch (error) {
        console.error("Winston detection API error:", error)
        return NextResponse.json(
            {
                error: "Failed to analyze content",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500, headers: corsHeaders },
        )
    }
}

async function performAIDetection(text: string, apiKey: string) {
    try {
        const response = await fetch("https://api.gowinston.ai/v2/ai-content-detection", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                version: "3.0",
                sentences: true,
                language: "en",
            }),
        })

        if (!response.ok) {
            throw new Error(`Winston AI detection API error: ${response.status}`)
        }

        const data = await response.json()

        // Transform Winston response to our format
        return {
            likelihood: Math.round(data.score || 0), // Winston returns score 0-100
            risk_level: getRiskLevel(data.score || 0),
            confidence: 0.95, // Winston doesn't provide confidence, use high default
            readability_score: data.readability_score,
            attack_detected: data.attack_detected,
            sentence_scores: data.sentences ? [data.sentences] : [], // Winston returns single sentence object
            credits_used: data.credits_used,
            credits_remaining: data.credits_remaining,
            version: data.version,
            indicators: generateAIIndicators(data),
            raw_response: data,
        }
    } catch (error) {
        console.error("AI detection error:", error)
        throw error
    }
}

async function performPlagiarismDetection(text: string, apiKey: string) {
    try {
        const response = await fetch("https://api.gowinston.ai/v2/plagiarism", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                language: "en",
                country: "us",
            }),
        })

        if (!response.ok) {
            throw new Error(`Winston plagiarism API error: ${response.status}`)
        }

        const data = await response.json()

        // Transform Winston response to our format
        return {
            percentage: Math.round(data.result?.score || 0), // Winston returns score 0-100
            risk_level: getRiskLevel(data.result?.score || 0),
            source_count: data.result?.sourceCounts || 0,
            total_plagiarism_words: data.result?.totalPlagiarismWords || 0,
            identical_word_count: data.result?.identicalWordCounts || 0,
            similar_word_count: data.result?.similarWordCounts || 0,
            text_word_count: data.result?.textWordCounts || 0,
            sources: data.sources || [],
            attack_detected: data.attackDetected,
            credits_used: data.credits_used,
            credits_remaining: data.credits_remaining,
            indicators: generatePlagiarismIndicators(data),
            raw_response: data,
        }
    } catch (error) {
        console.error("Plagiarism detection error:", error)
        throw error
    }
}

function getRiskLevel(score: number): "low" | "medium" | "high" {
    if (score >= 70) return "high"
    if (score >= 40) return "medium"
    return "low"
}

function generateAIIndicators(data: any): string[] {
    const indicators = []

    if (data.score > 80) {
        indicators.push("High AI probability detected by Winston AI")
    }
    if (data.score > 60) {
        indicators.push("Significant AI patterns identified")
    }
    if (data.attack_detected?.zero_width_space) {
        indicators.push("Zero-width space characters detected (potential AI evasion)")
    }
    if (data.attack_detected?.homoglyph_attack) {
        indicators.push("Homoglyph attack detected (character substitution)")
    }
    if (data.readability_score > 80) {
        indicators.push("Unusually high readability score")
    }

    return indicators
}

function generatePlagiarismIndicators(data: any): string[] {
    const indicators = []

    if (data.result?.score > 70) {
        indicators.push("High plagiarism score detected")
    }
    if (data.result?.sourceCounts > 5) {
        indicators.push(`Multiple sources detected (${data.result.sourceCounts} sources)`)
    }
    if (data.result?.identicalWordCounts > 50) {
        indicators.push(`${data.result.identicalWordCounts} identical words found`)
    }
    if (data.result?.similarWordCounts > 100) {
        indicators.push(`${data.result.similarWordCounts} similar words found`)
    }
    if (data.attackDetected?.zero_width_space) {
        indicators.push("Zero-width space characters detected")
    }
    if (data.attackDetected?.homoglyph_attack) {
        indicators.push("Character substitution attack detected")
    }

    return indicators
}
