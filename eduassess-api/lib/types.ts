// Shared types for the application
export interface Selection {
  text: string
  timestamp: number
  url: string
  title: string
}

export interface AssessmentResult {
  overall: {
    score: number
    grade: string
    strengths: string[]
    improvements: string[]
  }
  sentences: Array<{
    text: string
    feedback: string
    type: "positive" | "warning" | "error"
    suggestions: string[]
  }>
  detailed_feedback: {
    structure: string
    content: string
    grammar: string
    citations: string
  }
  recommendations: string[]
  metadata?: {
    assessedAt: string
    selectionsCount: number
    totalWords: number
    sources: Array<{
      url: string
      title: string
      timestamp: number
    }>
  }
}

export interface ExtensionConfig {
  apiUrl: string
  assignmentTypes: string[]
  educationLevels: string[]
  focusAreas: string[]
}
