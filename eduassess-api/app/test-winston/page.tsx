"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Zap, TestTube, DollarSign } from "lucide-react"

export default function TestWinstonPage() {
    const [testText, setTestText] =
        useState(`The Industrial Revolution: Catalyst of Modern Economic and Social Transformation

The Industrial Revolution, which began in Great Britain in the late 18th century and spread to other parts of Europe and North America by the 19th century, marked a turning point in human history. It fundamentally altered the economic structures and social fabric of society, transforming agrarian economies into industrial powerhouses. This essay argues that the Industrial Revolution was a pivotal moment in history that led to unprecedented economic growth, significant changes in labor systems, and profound social restructuring.

Economic Impact: Rise of Mechanization and Capitalism

One of the most immediate and visible effects of the Industrial Revolution was the mechanization of production. Innovations such as James Watt's steam engine (1769), Richard Arkwright's water frame (1769), and Edmund Cartwright's power loom (1785) revolutionized the textile industry, increasing output and reducing the cost of goods. This mechanization shifted production from small-scale, home-based work to centralized factories.`)

    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [testType, setTestType] = useState("both")

    const testOptions = [
        { id: "ai", name: "AI Detection Only", description: "Test Winston AI's AI content detection" },
        { id: "plagiarism", name: "Plagiarism Only", description: "Test Winston AI's plagiarism detection" },
        { id: "both", name: "Both AI & Plagiarism", description: "Test both detection services" },
        { id: "assessment", name: "Full Assessment", description: "Complete assessment with Winston AI integration" },
    ]

    const testWinston = async () => {
        setLoading(true)
        setResults(null)

        try {
            let endpoint = "/api/winston-detection"
            let requestBody: any = { text: testText }

            if (testType === "assessment") {
                endpoint = "/api/assess"
                requestBody = {
                    selections: [
                        {
                            text: testText,
                            timestamp: Date.now(),
                            url: "http://localhost:3000/test-winston",
                            title: "Winston AI Test",
                        },
                    ],
                    assignmentType: "essay",
                    educationLevel: "high-school",
                    focusAreas: ["grammar", "structure", "content"],
                    useExternalDetection: true,
                }
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            setResults(data)
        } catch (error) {
            console.error("Winston test failed:", error)
            setResults({
                error: error instanceof Error ? error.message : "Unknown error occurred",
            })
        } finally {
            setLoading(false)
        }
    }

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case "high":
                return "text-red-600 bg-red-50 border-red-200"
            case "medium":
                return "text-yellow-600 bg-yellow-50 border-yellow-200"
            case "low":
                return "text-green-600 bg-green-50 border-green-200"
            default:
                return "text-gray-600 bg-gray-50 border-gray-200"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Winston AI Integration Test</h1>
                    <p className="text-gray-600">
                        Test Winston AI's detection capabilities and integration with the assessment system
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Panel - Test Configuration */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TestTube className="w-5 h-5" />
                                    Winston AI Test Options
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {testOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                testType === option.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => setTestType(option.id)}
                                        >
                                            <div className="font-medium text-gray-900">{option.name}</div>
                                            <div className="text-sm text-gray-600">{option.description}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                        <strong className="text-blue-800">
                                            Selected: {testOptions.find((t) => t.id === testType)?.name}
                                        </strong>
                                    </div>
                                    <p className="text-sm text-blue-700">{testOptions.find((t) => t.id === testType)?.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Winston AI Credits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="font-medium text-green-800">Free Trial Available</div>
                                        <div className="text-green-700">2,000 words free when you sign up</div>
                                        <div className="text-green-600 mt-1">✅ No credit card required</div>
                                    </div>
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="font-medium text-blue-800">Pricing After Trial</div>
                                        <div className="text-blue-700">Starting at $12/month</div>
                                        <div className="text-blue-600">$0.01 per 100 words</div>
                                    </div>
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="font-medium text-yellow-800">Current Test</div>
                                        <div className="text-yellow-700">
                                            Words: {testText.split(" ").length} (~{Math.ceil(testText.split(" ").length / 100)} credits)
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>📝 Test Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Textarea
                                        value={testText}
                                        onChange={(e) => setTestText(e.target.value)}
                                        rows={8}
                                        className="text-sm"
                                        placeholder="Enter text to test with Winston AI..."
                                    />
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{testText.length} characters</Badge>
                                        <Badge variant="outline">{testText.split(" ").length} words</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button onClick={testWinston} disabled={loading || !testText.trim()} className="w-full" size="lg">
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Testing with Winston AI...
                                </>
                            ) : (
                                <>
                                    <TestTube className="w-4 h-4 mr-2" />
                                    Test {testOptions.find((t) => t.id === testType)?.name}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Right Panel - Results */}
                    <div>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Winston AI Test Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="max-h-[800px] overflow-y-auto">
                                {!results && !loading && (
                                    <div className="text-center py-12 text-gray-500">
                                        <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Select a test type and click "Test" to see Winston AI results</p>
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                                            <strong>Winston AI Features:</strong>
                                            <ul className="list-disc list-inside mt-2 text-left">
                                                <li>AI content detection with sentence-level analysis</li>
                                                <li>Plagiarism detection with source matching</li>
                                                <li>Attack detection (zero-width spaces, homoglyphs)</li>
                                                <li>Readability scoring</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {loading && (
                                    <div className="text-center py-12">
                                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-600">Running Winston AI analysis...</p>
                                        <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                                    </div>
                                )}

                                {results && results.error && (
                                    <div className="text-center py-8">
                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-red-700 mb-2">Test Failed</h3>
                                        <p className="text-red-600">{results.error}</p>
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                            <strong>Troubleshooting:</strong>
                                            <ul className="list-disc list-inside mt-2 text-left">
                                                <li>Make sure WINSTON_API_KEY is set in .env.local</li>
                                                <li>Check if you have credits remaining in your Winston AI account</li>
                                                <li>Verify your API key is valid</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {results && !results.error && (
                                    <div className="space-y-6">
                                        {/* Winston AI Detection Results */}
                                        {(results.ai_detection || results.plagiarism_check) && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">🔍 Winston AI Detection Results</h3>

                                                <div className="grid gap-4">
                                                    {results.ai_detection && !results.ai_detection.error && (
                                                        <Card className={`border-l-4 ${getRiskColor(results.ai_detection.risk_level)}`}>
                                                            <CardContent className="pt-4">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="font-semibold">🤖 AI Content Detection</h4>
                                                                    <Badge className={getRiskColor(results.ai_detection.risk_level)}>
                                                                        {results.ai_detection.risk_level.toUpperCase()} RISK
                                                                    </Badge>
                                                                </div>

                                                                <div className="text-center mb-4">
                                                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                                                        {results.ai_detection.likelihood}%
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">AI Likelihood Score</div>
                                                                </div>

                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span>Readability Score:</span>
                                                                        <span>{results.ai_detection.readability_score || "N/A"}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>Credits Used:</span>
                                                                        <span>{results.ai_detection.credits_used || 0}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>Credits Remaining:</span>
                                                                        <span>{results.ai_detection.credits_remaining || "N/A"}</span>
                                                                    </div>
                                                                </div>

                                                                {results.ai_detection.attack_detected && (
                                                                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                                                                        <div className="font-medium text-red-800">⚠️ Attacks Detected:</div>
                                                                        {results.ai_detection.attack_detected.zero_width_space && (
                                                                            <div className="text-red-700">• Zero-width space characters</div>
                                                                        )}
                                                                        {results.ai_detection.attack_detected.homoglyph_attack && (
                                                                            <div className="text-red-700">• Homoglyph character substitution</div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {results.ai_detection.indicators && results.ai_detection.indicators.length > 0 && (
                                                                    <div className="mt-3">
                                                                        <div className="font-medium text-sm mb-1">Indicators:</div>
                                                                        <ul className="list-disc list-inside text-xs text-gray-600">
                                                                            {results.ai_detection.indicators.map((indicator: string, i: number) => (
                                                                                <li key={i}>{indicator}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    )}

                                                    {results.plagiarism_check && !results.plagiarism_check.error && (
                                                        <Card className={`border-l-4 ${getRiskColor(results.plagiarism_check.risk_level)}`}>
                                                            <CardContent className="pt-4">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="font-semibold">📄 Plagiarism Detection</h4>
                                                                    <Badge className={getRiskColor(results.plagiarism_check.risk_level)}>
                                                                        {results.plagiarism_check.risk_level.toUpperCase()} RISK
                                                                    </Badge>
                                                                </div>

                                                                <div className="text-center mb-4">
                                                                    <div className="text-3xl font-bold text-red-600 mb-2">
                                                                        {results.plagiarism_check.percentage}%
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">Plagiarism Score</div>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <div className="font-medium">Sources Found:</div>
                                                                        <div className="text-gray-600">{results.plagiarism_check.source_count || 0}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium">Total Words:</div>
                                                                        <div className="text-gray-600">{results.plagiarism_check.text_word_count || 0}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium">Identical Words:</div>
                                                                        <div className="text-gray-600">
                                                                            {results.plagiarism_check.identical_word_count || 0}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium">Similar Words:</div>
                                                                        <div className="text-gray-600">
                                                                            {results.plagiarism_check.similar_word_count || 0}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {results.plagiarism_check.sources && results.plagiarism_check.sources.length > 0 && (
                                                                    <div className="mt-3">
                                                                        <div className="font-medium text-sm mb-2">Sources Found:</div>
                                                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                                                            {results.plagiarism_check.sources.slice(0, 3).map((source: any, i: number) => (
                                                                                <div key={i} className="p-2 bg-gray-50 rounded text-xs">
                                                                                    <div className="font-medium">{source.title || "Unknown Source"}</div>
                                                                                    <div className="text-gray-600">{source.url}</div>
                                                                                    <div className="text-red-600">
                                                                                        {source.plagiarismWords || 0} words ({source.score || 0}% match)
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Full Assessment Results */}
                                        {results.overall && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">📊 Complete Assessment Results</h3>

                                                <Tabs defaultValue="summary" className="w-full">
                                                    <TabsList className="grid w-full grid-cols-3">
                                                        <TabsTrigger value="summary">Summary</TabsTrigger>
                                                        <TabsTrigger value="detailed">Detailed</TabsTrigger>
                                                        <TabsTrigger value="info">Info</TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="summary" className="space-y-4">
                                                        <div className="text-center">
                                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                                                                <div className="text-center">
                                                                    <div className="text-2xl font-bold text-blue-600">{results.overall.score}%</div>
                                                                    <div className="text-sm font-semibold text-gray-700">{results.overall.grade}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                                <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
                                                                <ul className="space-y-1">
                                                                    {results.overall.strengths.map((strength: string, i: number) => (
                                                                        <li key={i} className="text-sm text-green-700">
                                                                            • {strength}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                                <h4 className="font-semibold text-orange-800 mb-2">⚠️ Improvements</h4>
                                                                <ul className="space-y-1">
                                                                    {results.overall.improvements.map((improvement: string, i: number) => (
                                                                        <li key={i} className="text-sm text-orange-700">
                                                                            • {improvement}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </TabsContent>

                                                    <TabsContent value="detailed" className="space-y-4">
                                                        {results.detailed_feedback && (
                                                            <div className="space-y-3">
                                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                                    <h5 className="font-semibold text-gray-800 mb-2">📝 Structure</h5>
                                                                    <p className="text-sm text-gray-700">{results.detailed_feedback.structure}</p>
                                                                </div>
                                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                                    <h5 className="font-semibold text-gray-800 mb-2">💡 Content</h5>
                                                                    <p className="text-sm text-gray-700">{results.detailed_feedback.content}</p>
                                                                </div>
                                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                                    <h5 className="font-semibold text-gray-800 mb-2">✏️ Grammar</h5>
                                                                    <p className="text-sm text-gray-700">{results.detailed_feedback.grammar}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </TabsContent>

                                                    <TabsContent value="info" className="space-y-4">
                                                        {results.metadata && (
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <strong>Word Count:</strong>
                                                                        <div className="text-gray-600">{results.metadata.totalWords}</div>
                                                                    </div>
                                                                    <div>
                                                                        <strong>External Detection:</strong>
                                                                        <div className="text-gray-600">
                                                                            {results.metadata.externalDetectionUsed ? "✅ Winston AI" : "❌ Not Used"}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <strong>Credits Used:</strong>
                                                                        <div className="text-gray-600">{results.metadata.winstonCreditsUsed || 0}</div>
                                                                    </div>
                                                                    <div>
                                                                        <strong>Credits Remaining:</strong>
                                                                        <div className="text-gray-600">
                                                                            {results.metadata.winstonCreditsRemaining || "N/A"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                        )}

                                        {/* Provider Info */}
                                        {results.provider && (
                                            <Card className="bg-blue-50 border-blue-200">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Zap className="w-4 h-4 text-blue-600" />
                                                        <strong className="text-blue-800">Detection Provider: {results.provider}</strong>
                                                    </div>
                                                    <div className="text-sm text-blue-700">
                                                        Scan completed at: {new Date(results.scan_time).toLocaleString()}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
