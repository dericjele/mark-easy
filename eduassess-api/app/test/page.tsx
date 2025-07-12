"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function TestPage() {
  const [testText, setTestText] = useState(
    "The Industrial Revolution was a period of major industrialization that took place during the late 1700s and early 1800s. This period saw the mechanization of agriculture and textile manufacturing and a revolution in power, including steam ships and railroads, that effected social, cultural and economic conditions.",
  )
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testAssessment = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selections: [
            {
              text: testText,
              timestamp: Date.now(),
              url: "http://localhost:3000/test",
              title: "Test Assessment",
            },
          ],
          assignmentType: "essay",
          educationLevel: "high-school",
          focusAreas: ["grammar", "structure", "content"],
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Assessment API</h1>
          <p className="text-gray-600">Test your Grok API integration</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sample Text to Assess</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              rows={6}
              className="mb-4"
              placeholder="Enter text to assess..."
            />
            <Button onClick={testAssessment} disabled={loading || !testText.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assessing...
                </>
              ) : (
                "Test Assessment"
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <strong>Error:</strong> {error}
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{result.overall?.score}%</div>
                  <div className="text-xl font-semibold text-gray-700">Grade: {result.overall?.grade}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {result.overall?.strengths?.map((strength: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Improvements</h4>
                    <ul className="space-y-1">
                      {result.overall?.improvements?.map((improvement: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <AlertCircle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {result.recommendations && (
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Recommendations</h4>
                    <div className="space-y-2">
                      {result.recommendations.map((rec: string, i: number) => (
                        <Badge key={i} variant="outline" className="mr-2 mb-2">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
