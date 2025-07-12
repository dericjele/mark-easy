import { generateText } from "ai"
import { createXai } from "@ai-sdk/xai"
import { type NextRequest, NextResponse } from "next/server"

interface AssessmentRequest {
    selections: Array<{
        text: string
        timestamp: number
        url: string
        title: string
    }>
    assignmentType: string
    educationLevel: string
    focusAreas?: string[]
    customRubric?: string
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(request: NextRequest) {
    return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
    try {
        const grokApiKey = process.env.GROK_API_KEY
        if (!grokApiKey) {
            return NextResponse.json({ error: "Grok API key not configured" }, { status: 500, headers: corsHeaders })
        }

        const body: AssessmentRequest = await request.json()
        const { selections, assignmentType, educationLevel, focusAreas, customRubric } = body

        if (!selections || selections.length === 0) {
            return NextResponse.json({ error: "No content provided for assessment" }, { status: 400, headers: corsHeaders })
        }

        const combinedText = selections.map((s) => s.text).join("\n\n")

        // Step 1: Winston AI Detection (for essays only)
        let winstonResults = null
        if (assignmentType === "essay" && process.env.WINSTON_API_KEY) {
            try {
                console.log("🔍 Running Winston AI detection...")
                const detectionResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/winston-detection`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: combinedText }),
                    },
                )

                if (detectionResponse.ok) {
                    winstonResults = await detectionResponse.json()
                    console.log("✅ Winston AI detection completed")
                }
            } catch (error) {
                console.warn("⚠️ Winston AI detection failed, continuing with Grok assessment:", error)
            }
        }

        // Step 2: Grok Assessment (grading and feedback)
        const assessmentPrompt = createAssessmentPrompt(
            combinedText,
            assignmentType,
            educationLevel,
            focusAreas,
            customRubric,
        )

        const xaiProvider = createXai({
            apiKey: process.env.GROK_API_KEY ?? "",
            baseURL: process.env.GROK_API_URL ?? "https://api.x.ai/v1",
        })

        const { text } = await generateText({
            model: xaiProvider("grok-2-1212"),
            prompt: assessmentPrompt,
            temperature: 0.3,
            maxTokens: 2500,
        })

        // Step 3: Combine results
        const assessmentResult = parseGrokResponse(text, selections, assignmentType, winstonResults)

        return NextResponse.json(assessmentResult, { headers: corsHeaders })
    } catch (error) {
        console.error("Assessment API error:", error)
        return NextResponse.json(
            {
                error: "Failed to process assessment",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500, headers: corsHeaders },
        )
    }
}

function createAssessmentPrompt(
    text: string,
    assignmentType: string,
    educationLevel: string,
    focusAreas?: string[],
    customRubric?: string,
): string {
    const focusAreasText = focusAreas?.length ? `Focus particularly on: ${focusAreas.join(", ")}.` : ""
    const typeInstructions = getTypeSpecificInstructions(assignmentType)
    const rubricSection = customRubric
        ? `\nCUSTOM RUBRIC CRITERIA:\n${customRubric}\n\nPlease use these specific criteria in your assessment.`
        : ""

    return `You are an expert educational assessor. Please assess the following ${assignmentType} written by a ${educationLevel} student.

CONTENT TO ASSESS:
"""
${text}
"""

ASSESSMENT REQUIREMENTS:
- Assignment Type: ${assignmentType}
- Education Level: ${educationLevel}
- ${focusAreasText}

${typeInstructions}${rubricSection}

IMPORTANT: Focus ONLY on educational assessment criteria. Do NOT include AI detection or plagiarism analysis - that will be handled separately.

Please provide your assessment in the following JSON format (return ONLY the JSON, no markdown formatting):

{
  "overall": {
    "score": [0-100 numerical score],
    "grade": "[letter grade like A+, B-, etc.]",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "improvements": ["improvement 1", "improvement 2", "improvement 3"]
  },
  "sentences": [
    {
      "text": "[exact sentence text]",
      "feedback": "[specific feedback for this sentence]",
      "type": "positive|warning|error",
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
  ],
  "detailed_feedback": {
    "structure": "[feedback on structure and organization]",
    "content": "[feedback on content quality and depth]",
    "grammar": "[feedback on grammar and language use]",
    "citations": "[feedback on citations if applicable]"
  },
  "recommendations": [
    "[actionable recommendation 1]",
    "[actionable recommendation 2]",
    "[actionable recommendation 3]"
  ]
}`
}

function getTypeSpecificInstructions(assignmentType: string): string {
    const instructions = {
        essay: `
ESSAY ASSESSMENT FOCUS:
- Evaluate thesis statement clarity and strength
- Assess logical flow and organization of arguments
- Check for proper use of evidence and examples
- Review conclusion effectiveness
- Analyze overall coherence and persuasiveness`,

        "short-answer": `
SHORT ANSWER ASSESSMENT FOCUS:
- Check if the response directly addresses the question
- Evaluate accuracy and completeness of information
- Assess clarity and conciseness
- Look for relevant examples or explanations`,

        "multiple-choice": `
MULTIPLE CHOICE ASSESSMENT FOCUS:
- Verify correct answer selection
- Assess understanding of key concepts
- Focus on correctness rather than detailed analysis`,

        "true-false": `
TRUE/FALSE ASSESSMENT FOCUS:
- Verify correct identification of true/false
- Assess understanding of the core statement
- Focus on correctness and basic understanding`,

        math: `
MATH PROBLEM ASSESSMENT FOCUS:
- Check correctness of mathematical procedures
- Verify accuracy of calculations step by step
- Assess clarity of step-by-step work
- Review proper use of formulas and methods
- Evaluate final answer correctness and formatting`,
    }

    return instructions[assignmentType as keyof typeof instructions] || instructions.essay
}

function parseGrokResponse(
    grokResponse: string,
    originalSelections: any[],
    assignmentType: string,
    winstonResults?: any,
) {
    try {
        let cleanedResponse = grokResponse.trim()

        if (cleanedResponse.startsWith("```json")) {
            cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
        } else if (cleanedResponse.startsWith("```")) {
            cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
        }

        const parsed = JSON.parse(cleanedResponse.trim())

        // Add Winston AI results if available
        if (winstonResults && assignmentType === "essay") {
            if (winstonResults.ai_detection && !winstonResults.ai_detection.error) {
                parsed.ai_detection = {
                    score: winstonResults.ai_detection.likelihood,
                    risk_level: winstonResults.ai_detection.risk_level,
                    confidence: winstonResults.ai_detection.confidence,
                    provider: "winston_ai",
                }
            }
            if (winstonResults.plagiarism_check && !winstonResults.plagiarism_check.error) {
                parsed.plagiarism_check = {
                    score: winstonResults.plagiarism_check.percentage,
                    risk_level: winstonResults.plagiarism_check.risk_level,
                    source_count: winstonResults.plagiarism_check.source_count || 0,
                    provider: "winston_ai",
                }
            }
        }

        // Add metadata
        parsed.metadata = {
            assessedAt: new Date().toISOString(),
            selectionsCount: originalSelections.length,
            totalWords: originalSelections.reduce((acc, sel) => acc + sel.text.split(" ").length, 0),
            assignmentType: assignmentType,
            hasWinstonDetection: !!(winstonResults && assignmentType === "essay"),
            winstonCreditsUsed: winstonResults?.ai_detection?.credits_used || 0,
        }

        return parsed
    } catch (error) {
        console.error("Failed to parse Grok response:", error)

        return {
            overall: {
                score: 75,
                grade: "B",
                strengths: ["Content provided for assessment"],
                improvements: ["Assessment parsing failed - please try again"],
            },
            sentences: [],
            detailed_feedback: {
                structure: "Unable to assess due to parsing error",
                content: "Unable to assess due to parsing error",
                grammar: "Unable to assess due to parsing error",
                citations: "Unable to assess due to parsing error",
            },
            recommendations: ["Please try submitting your content again"],
            error: "Failed to parse AI response",
            metadata: {
                assessedAt: new Date().toISOString(),
                selectionsCount: originalSelections.length,
                totalWords: originalSelections.reduce((acc, sel) => acc + sel.text.split(" ").length, 0),
                assignmentType: assignmentType,
            },
        }
    }
}
