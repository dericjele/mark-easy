"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Settings } from "lucide-react"

export default function Home() {
    const [configStatus, setConfigStatus] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkConfiguration()
    }, [])

    const checkConfiguration = async () => {
        try {
            const response = await fetch("/api/config")
            const data = await response.json()
            setConfigStatus(data)
        } catch (error) {
            console.error("Failed to check configuration:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Checking configuration...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">EduAssess AI API</h1>
                    <p className="text-gray-600">Backend service for the Chrome extension</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Configuration Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span>Grok API Key</span>
                                    {configStatus?.details?.grokApiKey ? (
                                        <Badge className="bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Configured
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Missing
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span>API URL</span>
                                    {configStatus?.details?.grokApiUrl ? (
                                        <Badge className="bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Set
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Default
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span>Environment</span>
                                    <Badge variant="outline">{configStatus?.details?.environment}</Badge>
                                </div>
                            </div>

                            {!configStatus?.configured && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Setup Required:</strong> Add your Grok API key to the <code>.env.local</code> file
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>API Endpoints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <code className="text-sm">POST /api/assess</code>
                                    <Badge variant="outline">Assessment</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <code className="text-sm">GET /api/config</code>
                                    <Badge variant="outline">Config</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {configStatus?.configured && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-green-700">✅ Ready to Use!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-gray-600">
                                    Your API is properly configured with Grok for assessment and Winston AI for detection.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">🧠 Grok AI</h4>
                                        <p className="text-sm text-blue-700">Handles educational assessment, grading, and feedback</p>
                                    </div>

                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">🔍 Winston AI</h4>
                                        <p className="text-sm text-green-700">Provides AI detection and plagiarism checking for essays</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={checkConfiguration}>Refresh Status</Button>
                                    <Button variant="outline" asChild>
                                        <a href="/test-winston">Test Winston Integration</a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
