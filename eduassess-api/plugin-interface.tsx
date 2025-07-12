"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Brain,
  CheckCircle,
  AlertCircle,
  Star,
  FileText,
  MessageSquare,
  Bookmark,
  Download,
  Share2,
  Settings,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react"

export default function Component() {
  const [selectedText, setSelectedText] = useState(
    "The Industrial Revolution was a period of major industrialization that took place during the late 1700s and early 1800s. This period saw the mechanization of agriculture and textile manufacturing and a revolution in power, including steam ships and railroads, that effected social, cultural and economic conditions.",
  )
  const [showPopover, setShowPopover] = useState(true)
  const [assessmentMode, setAssessmentMode] = useState("feedback")
  const [cachedSelections, setCachedSelections] = useState(3)

  const feedbackData = {
    overall: {
      score: 78,
      grade: "B+",
      strengths: ["Clear chronological structure", "Good use of specific examples", "Appropriate academic tone"],
      improvements: [
        "Needs more detailed analysis",
        "Could benefit from primary sources",
        "Conclusion could be stronger",
      ],
    },
    sentences: [
      {
        text: "The Industrial Revolution was a period of major industrialization that took place during the late 1700s and early 1800s.",
        feedback: "Good opening sentence with clear timeframe. Consider being more specific about geographical scope.",
        type: "positive",
        suggestions: ["Add geographical context (Britain, Europe)", "Consider mentioning key innovations"],
      },
      {
        text: "This period saw the mechanization of agriculture and textile manufacturing and a revolution in power, including steam ships and railroads, that effected social, cultural and economic conditions.",
        feedback:
          "Grammar error: 'effected' should be 'affected'. Good coverage of key areas but sentence is too long.",
        type: "warning",
        suggestions: ["Split into two sentences", "Fix grammar error", "Add specific examples"],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Text Selection Popover */}
      {showPopover && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="w-80 shadow-lg border-2 border-blue-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Text Selected</span>
                <Badge variant="secondary" className="ml-auto">
                  {selectedText.length} chars
                </Badge>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-3 text-sm text-gray-700 max-h-20 overflow-y-auto">
                "{selectedText.substring(0, 100)}..."
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setAssessmentMode("feedback")}
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Assess Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setCachedSelections((prev) => prev + 1)}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  Cache ({cachedSelections})
                </Button>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-xs text-gray-500">Assignment Type:</span>
                <Badge variant="outline">Essay</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Assessment Interface */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EduAssess AI</h1>
              <p className="text-gray-600">Intelligent Assignment Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {cachedSelections} Cached
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Assessment Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Assessment Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Assignment Type</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Essay</option>
                    <option>Multiple Choice</option>
                    <option>Short Answer</option>
                    <option>True/False</option>
                    <option>Graph Analysis</option>
                    <option>Creative Writing</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Education Level</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Graduate</option>
                    <option>Elementary</option>
                    <option>Middle School</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Focus Areas</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Grammar</Badge>
                    <Badge variant="secondary">Structure</Badge>
                    <Badge variant="secondary">Content</Badge>
                    <Badge variant="secondary">Citations</Badge>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Full Report
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Selections</span>
                    <span className="font-medium">{cachedSelections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Word Count</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reading Level</span>
                    <span className="font-medium">Grade 11</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Feedback Display */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="feedback" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feedback">Live Feedback</TabsTrigger>
                <TabsTrigger value="overall">Overall Report</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="feedback" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Sentence-by-Sentence Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {feedbackData.sentences.map((sentence, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              sentence.type === "positive" ? "bg-green-100" : "bg-yellow-100"
                            }`}
                          >
                            {sentence.type === "positive" ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 p-3 rounded-lg mb-2 text-sm">"{sentence.text}"</div>
                            <p className="text-sm text-gray-700 mb-2">{sentence.feedback}</p>
                            <div className="flex flex-wrap gap-1">
                              {sentence.suggestions.map((suggestion, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {suggestion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overall" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Overall Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{feedbackData.overall.score}%</div>
                      <div className="text-2xl font-semibold text-gray-700 mb-2">
                        Grade: {feedbackData.overall.grade}
                      </div>
                      <Progress value={feedbackData.overall.score} className="w-full" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {feedbackData.overall.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <Star className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {feedbackData.overall.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <TrendingUp className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Structural Improvements</h4>
                        <p className="text-sm text-blue-700">
                          Consider adding transition sentences between paragraphs to improve flow. Your argument would
                          benefit from a stronger thesis statement in the introduction.
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Content Enhancement</h4>
                        <p className="text-sm text-green-700">
                          Include more specific examples and evidence to support your main points. Consider citing
                          primary sources from the Industrial Revolution period.
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Style & Grammar</h4>
                        <p className="text-sm text-purple-700">
                          Watch for affect vs. effect usage. Vary your sentence structure to maintain reader engagement.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share Feedback
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Generate Rubric
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
