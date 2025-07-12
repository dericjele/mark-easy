"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, BookOpen, Calculator, FileText, HelpCircle, Zap, AlertTriangle } from "lucide-react"

export default function TestRubricsPage() {
    const [selectedType, setSelectedType] = useState("essay")
    const [customRubric, setCustomRubric] = useState("")
    const [testResults, setTestResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    // Sample content for different assignment types
    const sampleContent = {
        essay: `The Industrial Revolution was a period of major industrialization that took place during the late 1700s and early 1800s. This transformative era fundamentally altered the fabric of society, ushering in unprecedented changes in manufacturing, transportation, and social structures.

The revolution began in Britain and spread throughout Europe and North America. Key innovations included the steam engine, spinning jenny, and power loom. These technological advances transformed manufacturing from hand production to mechanized factory production. The steam engine, invented by James Watt, revolutionized transportation and manufacturing processes.

However, the Industrial Revolution also brought significant social challenges. Working conditions in factories were often dangerous and unhealthy. Child labor was common, and workers faced long hours for low wages. The rapid urbanization led to overcrowded cities with poor sanitation and living conditions.

Despite these challenges, the Industrial Revolution laid the foundation for modern industrial society. It increased productivity, created new job opportunities, and improved the standard of living for many people over time. The innovations of this period continue to influence our world today.`,

        "essay-plagiarized": `The Industrial Revolution was a period of major industrialization and technological advancement that fundamentally transformed society. According to Britannica Encyclopedia, "The Industrial Revolution was the transition to new manufacturing processes in Europe and the United States, in the period from about 1760 to sometime between 1820 and 1840."

This period saw the mechanization of agriculture and textile manufacturing and a revolution in power, including steam ships and railroads, that affected social, cultural and economic conditions. The revolution began in Britain due to several factors including abundant natural resources, capital accumulation, and favorable government policies.

Key innovations included the steam engine developed by James Watt, the spinning jenny invented by James Hargreaves, and the power loom created by Edmund Cartwright. These technological advances transformed manufacturing from hand production to mechanized factory production, leading to increased efficiency and productivity.

As noted by historians, "The Industrial Revolution brought about significant social and economic changes, including urbanization, the rise of the working class, and new forms of labor organization." Working conditions in factories were often dangerous and unhealthy, with long hours and low wages being common.`,

        "essay-ai-generated": `The Industrial Revolution: Catalyst of Modern Economic and Social Transformation

The Industrial Revolution, which began in Great Britain in the late 18th century and spread to other parts of Europe and North America by the 19th century, marked a turning point in human history. It fundamentally altered the economic structures and social fabric of society, transforming agrarian economies into industrial powerhouses. This essay argues that the Industrial Revolution was a pivotal moment in history that led to unprecedented economic growth, significant changes in labor systems, and profound social restructuring. Through specific historical examples and data, this essay will demonstrate how industrialization shaped modern life and laid the foundation for the contemporary global economy.

Economic Impact: Rise of Mechanization and Capitalism

One of the most immediate and visible effects of the Industrial Revolution was the mechanization of production. Innovations such as James Watt's steam engine (1769), Richard Arkwright's water frame (1769), and Edmund Cartwright's power loom (1785) revolutionized the textile industry, increasing output and reducing the cost of goods (Mokyr, 1990). This mechanization shifted production from small-scale, home-based work to centralized factories. As factories grew, so did urban centers, drawing large populations into cities and fundamentally changing economic life.

The increased productivity led to a surge in capitalist enterprise. Entrepreneurs invested in manufacturing infrastructure, and banks expanded credit to support industrial ventures. Britain's Gross Domestic Product (GDP) rose significantly, with estimates suggesting it tripled between 1760 and 1860 (Crafts & Harley, 1992). This economic boom not only enriched industrialists but also gradually improved living standards for some segments of the working population through increased access to goods and services.

Social Impact: Urbanization and Labor Conditions

The Industrial Revolution also brought significant social changes, most notably through rapid urbanization. Cities like Manchester and Birmingham expanded quickly, often without adequate planning or infrastructure. Overcrowded housing, poor sanitation, and frequent disease outbreaks became hallmarks of early industrial urban life (Engels, The Condition of the Working Class in England, 1845).

Furthermore, the labor system was transformed. Factory work replaced agricultural and artisanal labor, introducing regimented schedules and repetitive tasks. Many workers, including women and children, toiled in dangerous conditions for long hours with minimal pay. For instance, in 1833, a British parliamentary investigation revealed that children as young as nine worked twelve-hour shifts in textile mills. These exploitative conditions eventually led to labor reforms, such as the Factory Acts (beginning in 1833), which set minimum working ages and regulated hours.

Responses and Long-term Effects

Despite the immediate hardships faced by workers, the Industrial Revolution also sparked reform movements and new ideologies. The rise of socialism, spearheaded by thinkers like Karl Marx and Friedrich Engels, was partly a response to the stark inequalities of industrial capitalism. Simultaneously, the growing middle class began advocating for political and social reforms, contributing to broader democratic developments in Western societies.

Over time, industrialization contributed to a significant rise in life expectancy, literacy rates, and general living standards. Technological advancements improved transportation (e.g., railways, steamships) and communication (e.g., telegraphs), integrating national and global economies. While disparities remained, the long-term trajectory showed gradual improvements in economic opportunity and social mobility for many.

Conclusion

In conclusion, the Industrial Revolution was a transformative period that reshaped the global economy and social order. Through innovations in technology and production, it catalyzed economic growth, urbanization, and the emergence of a capitalist economy. However, these advancements came at the cost of severe social upheaval and labor exploitation. By examining its economic impacts, social consequences, and long-term reforms, we gain a comprehensive understanding of how the Industrial Revolution served as the foundation of modern industrial society. Recognizing both its achievements and challenges allows us to better appreciate its profound legacy and informs our approach to current technological transformations.`,

        "short-answer": `The water cycle consists of several key processes: evaporation, condensation, precipitation, and collection. Water evaporates from oceans, lakes, and rivers due to solar energy. This water vapor rises into the atmosphere where it cools and condenses into clouds. When the water droplets in clouds become too heavy, they fall as precipitation (rain, snow, sleet, or hail). The water then collects in bodies of water or soaks into the ground, completing the cycle.`,

        "multiple-choice": `Question: Which of the following best describes photosynthesis?
A) The process by which plants break down glucose for energy
B) The process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen
C) The process by which plants absorb nutrients from soil
D) The process by which plants reproduce

Student Answer: B) The process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen

Reasoning: Photosynthesis is the fundamental process that allows plants to create their own food using sunlight as energy. The equation is 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.`,

        "true-false": `Statement: "The mitochondria is often called the powerhouse of the cell because it produces ATP through cellular respiration."

Student Answer: True

Explanation: The mitochondria contains enzymes necessary for cellular respiration, which breaks down glucose and other molecules to produce ATP (adenosine triphosphate), the cell's main energy currency. This is why it's commonly referred to as the powerhouse of the cell.`,

        math: `Problem: Solve for x in the equation 2x + 5 = 17

Solution:
2x + 5 = 17
2x = 17 - 5    (subtract 5 from both sides)
2x = 12
x = 12 ÷ 2     (divide both sides by 2)
x = 6

Check: 2(6) + 5 = 12 + 5 = 17 ✓

Therefore, x = 6`,
    }

    // Add new essay type options to the type selection
    const essayTypes = {
        essay: "Standard Essay",
        "essay-plagiarized": "Essay (High Plagiarism Risk)",
        "essay-ai-generated": "Essay (AI-Generated Style)",
        "short-answer": "Short Answer",
        "multiple-choice": "Multiple Choice",
        "true-false": "True/False",
        math: "Math Problem",
    }

    // Preset rubrics for each type
    const presetRubrics = {
        essay: `Focus on:
• Thesis statement clarity and strength
• Logical flow and organization of arguments
• Use of evidence and examples
• Grammar, spelling, and sentence structure
• Conclusion effectiveness
• Overall coherence and clarity
• Originality and authenticity`,

        "essay-plagiarized": `Focus on:
• Thesis statement clarity and strength
• Logical flow and organization of arguments
• Use of evidence and examples
• Grammar, spelling, and sentence structure
• Conclusion effectiveness
• Overall coherence and clarity
• Originality and authenticity
• Proper citation and attribution
• Detection of potential plagiarism indicators`,

        "essay-ai-generated": `Focus on:
• Thesis statement clarity and strength
• Logical flow and organization of arguments
• Use of evidence and examples
• Grammar, spelling, and sentence structure
• Conclusion effectiveness
• Overall coherence and clarity
• Originality and authenticity
• Personal voice and unique perspective
• Detection of AI-generated content patterns`,

        "short-answer": `Evaluate:
• Direct response to the question
• Accuracy of information
• Clarity and conciseness
• Use of relevant examples
• Proper grammar and spelling`,

        "multiple-choice": `Check:
• Correct answer selection
• Understanding of key concepts
• Reasoning process (if shown)
• Elimination of incorrect options`,

        "true-false": `Assess:
• Correct identification of true/false
• Understanding of the statement
• Justification (if provided)
• Recognition of key facts`,

        math: `Review:
• Correct mathematical procedures
• Accuracy of calculations
• Clear step-by-step work
• Proper use of formulas
• Final answer correctness
• Units and formatting`,
    }

    const handleTypeChange = (type: string) => {
        setSelectedType(type)
        setCustomRubric(presetRubrics[type as keyof typeof presetRubrics])
        setTestResults(null)
    }

    const testAssessment = async () => {
        setLoading(true)
        setTestResults(null)

        try {
            const response = await fetch("/api/assess", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    selections: [
                        {
                            text: sampleContent[selectedType as keyof typeof sampleContent],
                            timestamp: Date.now(),
                            url: "http://localhost:3000/test-rubrics",
                            title: `Test ${selectedType.replace("-", " ")} Assessment`,
                        },
                    ],
                    assignmentType: selectedType,
                    educationLevel: "high-school",
                    focusAreas: ["grammar", "structure", "content"],
                    customRubric: customRubric,
                }),
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            setTestResults(data)
        } catch (err) {
            console.error("Assessment failed:", err)
            setTestResults({
                error: err instanceof Error ? err.message : "Unknown error occurred",
            })
        } finally {
            setLoading(false)
        }
    }

    const getTypeIcon = (type: string) => {
        const icons = {
            essay: <FileText className="w-4 h-4" />,
            "essay-plagiarized": <FileText className="w-4 h-4" />,
            "essay-ai-generated": <FileText className="w-4 h-4" />,
            "short-answer": <BookOpen className="w-4 h-4" />,
            "multiple-choice": <CheckCircle className="w-4 h-4" />,
            "true-false": <HelpCircle className="w-4 h-4" />,
            math: <Calculator className="w-4 h-4" />,
        }
        return icons[type as keyof typeof icons] || <FileText className="w-4 h-4" />
    }

    const getWarningMessage = (type: string) => {
        if (type === "essay-plagiarized") {
            return "This sample contains text patterns that typically indicate plagiarism, such as inconsistent writing styles, formal citations mixed with informal writing, and passages that appear to be copied from sources."
        } else if (type === "essay-ai-generated") {
            return "This sample exhibits characteristics commonly found in AI-generated content, including overly formal language, perfect structure, generic examples, comprehensive coverage without personal depth, and lack of individual voice or perspective."
        }
        return ""
    }

    const getExpectedDetection = (type: string) => {
        if (type === "essay-plagiarized") {
            return "70-85%"
        } else if (type === "essay-ai-generated") {
            return "85-95%"
        }
        return "N/A"
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Rubric System Test</h1>
                    <p className="text-gray-600">Test the enhanced AI and plagiarism detection with different assignment types</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Panel - Rubric Configuration */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Assignment Type Selection
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {Object.entries(essayTypes).map(([type, label]) => (
                                        <Button
                                            key={type}
                                            variant={selectedType === type ? "default" : "outline"}
                                            onClick={() => handleTypeChange(type)}
                                            className="flex items-center gap-2 justify-start text-left"
                                        >
                                            {getTypeIcon(type)}
                                            {label}
                                        </Button>
                                    ))}
                                </div>

                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getTypeIcon(selectedType)}
                                        <strong className="text-blue-800">
                                            Selected: {essayTypes[selectedType as keyof typeof essayTypes]}
                                        </strong>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        This will test the {selectedType} rubric with enhanced AI and plagiarism detection.
                                    </p>
                                </div>

                                {/* Red Warning for Test Samples */}
                                {(selectedType === "essay-plagiarized" || selectedType === "essay-ai-generated") && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="w-4 h-4 text-red-600" />
                                            <strong className="text-red-800">⚠️ Academic Integrity Warning</strong>
                                        </div>
                                        <p className="text-sm text-red-700 mb-2">
                                            <strong>Expected Detection Rate: {getExpectedDetection(selectedType)}</strong>
                                        </p>
                                        <p className="text-sm text-red-700">{getWarningMessage(selectedType)}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>📋 Custom Rubric Configuration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Assessment Criteria:</label>
                                        <Textarea
                                            value={customRubric}
                                            onChange={(e) => setCustomRubric(e.target.value)}
                                            rows={8}
                                            className="font-mono text-sm"
                                            placeholder="Enter custom assessment criteria..."
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{customRubric.length} characters</Badge>
                                        <Button onClick={() => setCustomRubric(presetRubrics[selectedType as keyof typeof presetRubrics])}>
                                            Reset to Preset
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>📝 Sample Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="text-sm text-gray-600 mb-2">
                                        Sample {essayTypes[selectedType as keyof typeof essayTypes].toLowerCase()} content:
                                    </div>
                                    <div className="text-sm bg-white p-3 rounded border max-h-40 overflow-y-auto">
                                        {sampleContent[selectedType as keyof typeof sampleContent]}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button onClick={testAssessment} disabled={loading || !customRubric.trim()} className="w-full" size="lg">
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Testing Enhanced Detection...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Test {selectedType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Assessment
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Right Panel - Results */}
                    <div>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Enhanced Assessment Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="max-h-[800px] overflow-y-auto">
                                {!testResults && !loading && (
                                    <div className="text-center py-12 text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>
                                            Select an assignment type and click "Test Assessment" to see enhanced AI and plagiarism detection
                                        </p>
                                    </div>
                                )}

                                {loading && (
                                    <div className="text-center py-12">
                                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-600">Processing {selectedType} with enhanced detection...</p>
                                        <p className="text-sm text-gray-500 mt-2">Analyzing for AI patterns and plagiarism indicators</p>
                                    </div>
                                )}

                                {testResults && testResults.error && (
                                    <div className="text-center py-8">
                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-red-700 mb-2">Assessment Failed</h3>
                                        <p className="text-red-600">{testResults.error}</p>
                                    </div>
                                )}

                                {testResults && testResults.overall && (
                                    <div className="space-y-6">
                                        {/* Score Display */}
                                        <div className="text-center">
                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{testResults.overall.score}%</div>
                                                    <div className="text-sm font-semibold text-gray-700">{testResults.overall.grade}</div>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">
                                                {selectedType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Assessment Complete
                                            </Badge>
                                        </div>

                                        {/* Academic Integrity Warnings */}
                                        {testResults &&
                                            testResults.overall &&
                                            (selectedType === "essay" ||
                                                selectedType === "essay-plagiarized" ||
                                                selectedType === "essay-ai-generated") && (
                                                <div className="mb-6">
                                                    <h4 className="text-lg font-semibold mb-4 text-center">🔍 Academic Integrity Analysis</h4>

                                                    {/* High Risk Warnings */}
                                                    {testResults.plagiarism_check && testResults.plagiarism_check.percentage > 60 && (
                                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                                                <strong className="text-red-800">🚨 HIGH PLAGIARISM RISK DETECTED</strong>
                                                            </div>
                                                            <p className="text-sm text-red-700 mb-2">
                                                                <strong>Likelihood: {testResults.plagiarism_check.percentage}%</strong> - This
                                                                submission shows strong indicators of plagiarized content.
                                                            </p>
                                                            <p className="text-xs text-red-600">
                                                                <strong>Recommendation:</strong> Review this submission carefully and consider
                                                                requesting original sources or resubmission.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {testResults.ai_detection && testResults.ai_detection.likelihood > 60 && (
                                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                                                <strong className="text-red-800">🤖 HIGH AI USAGE DETECTED</strong>
                                                            </div>
                                                            <p className="text-sm text-red-700 mb-2">
                                                                <strong>Likelihood: {testResults.ai_detection.likelihood}%</strong> - This submission
                                                                appears to be largely AI-generated.
                                                            </p>
                                                            <p className="text-xs text-red-600">
                                                                <strong>Recommendation:</strong> Discuss academic integrity policies and consider
                                                                requiring resubmission with original work.
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-4">
                                                        {testResults.plagiarism_check && (
                                                            <Card className="text-center">
                                                                <CardContent className="pt-4">
                                                                    <div className="mb-2">
                                                                        <div
                                                                            className={`text-2xl font-bold ${
                                                                                testResults.plagiarism_check.risk_level === "low"
                                                                                    ? "text-green-600"
                                                                                    : testResults.plagiarism_check.risk_level === "medium"
                                                                                        ? "text-yellow-600"
                                                                                        : "text-red-600"
                                                                            }`}
                                                                        >
                                                                            {testResults.plagiarism_check.percentage}%
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">Plagiarism Likelihood</div>
                                                                    </div>
                                                                    <Badge
                                                                        variant={
                                                                            testResults.plagiarism_check.risk_level === "low" ? "default" : "destructive"
                                                                        }
                                                                        className={`${
                                                                            testResults.plagiarism_check.risk_level === "low"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : testResults.plagiarism_check.risk_level === "medium"
                                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                                    : "bg-red-100 text-red-800"
                                                                        }`}
                                                                    >
                                                                        {testResults.plagiarism_check.risk_level.toUpperCase()} RISK
                                                                    </Badge>
                                                                    {testResults.plagiarism_check.indicators && (
                                                                        <div className="mt-2 text-xs text-gray-500">
                                                                            <strong>Indicators:</strong>
                                                                            <ul className="list-disc list-inside mt-1 text-left">
                                                                                {testResults.plagiarism_check.indicators.map((indicator: string, i: number) => (
                                                                                    <li key={i}>{indicator}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        )}

                                                        {testResults.ai_detection && (
                                                            <Card className="text-center">
                                                                <CardContent className="pt-4">
                                                                    <div className="mb-2">
                                                                        <div
                                                                            className={`text-2xl font-bold ${
                                                                                testResults.ai_detection.risk_level === "low"
                                                                                    ? "text-green-600"
                                                                                    : testResults.ai_detection.risk_level === "medium"
                                                                                        ? "text-yellow-600"
                                                                                        : "text-red-600"
                                                                            }`}
                                                                        >
                                                                            {testResults.ai_detection.likelihood}%
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">AI Generation Likelihood</div>
                                                                    </div>
                                                                    <Badge
                                                                        variant={testResults.ai_detection.risk_level === "low" ? "default" : "destructive"}
                                                                        className={`${
                                                                            testResults.ai_detection.risk_level === "low"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : testResults.ai_detection.risk_level === "medium"
                                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                                    : "bg-red-100 text-red-800"
                                                                        }`}
                                                                    >
                                                                        {testResults.ai_detection.risk_level.toUpperCase()} LIKELIHOOD
                                                                    </Badge>
                                                                    {testResults.ai_detection.indicators && (
                                                                        <div className="mt-2 text-xs text-gray-500">
                                                                            <strong>Indicators:</strong>
                                                                            <ul className="list-disc list-inside mt-1 text-left">
                                                                                {testResults.ai_detection.indicators.map((indicator: string, i: number) => (
                                                                                    <li key={i}>{indicator}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Tabbed Results */}
                                        <Tabs defaultValue="summary" className="w-full">
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="summary">Summary</TabsTrigger>
                                                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                                                <TabsTrigger value="metadata">Info</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="summary" className="space-y-4">
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-1">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Strengths
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {testResults.overall.strengths.map((strength: string, i: number) => (
                                                                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                                                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                                                    {strength}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                        <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            Areas for Improvement
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {testResults.overall.improvements.map((improvement: string, i: number) => (
                                                                <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                                                                    <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                                                    {improvement}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {testResults.recommendations && (
                                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                                                            <ul className="space-y-1">
                                                                {testResults.recommendations.map((rec: string, i: number) => (
                                                                    <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                                                                        <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                                        {rec}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="detailed" className="space-y-4 max-h-96 overflow-y-auto">
                                                {testResults.detailed_feedback && (
                                                    <div className="space-y-4">
                                                        <div className="grid gap-4">
                                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                                <h5 className="font-semibold text-gray-800 mb-2">📝 Structure & Organization</h5>
                                                                <p className="text-sm text-gray-700">{testResults.detailed_feedback.structure}</p>
                                                            </div>
                                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                                <h5 className="font-semibold text-gray-800 mb-2">💡 Content & Ideas</h5>
                                                                <p className="text-sm text-gray-700">{testResults.detailed_feedback.content}</p>
                                                            </div>
                                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                                <h5 className="font-semibold text-gray-800 mb-2">✏️ Grammar & Language</h5>
                                                                <p className="text-sm text-gray-700">{testResults.detailed_feedback.grammar}</p>
                                                            </div>
                                                            {testResults.detailed_feedback.citations && (
                                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                                    <h5 className="font-semibold text-gray-800 mb-2">📚 Citations & Sources</h5>
                                                                    <p className="text-sm text-gray-700">{testResults.detailed_feedback.citations}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {testResults.sentences && testResults.sentences.length > 0 && (
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold">Sentence Analysis</h4>
                                                        {testResults.sentences.slice(0, 3).map((sentence: any, i: number) => (
                                                            <div
                                                                key={i}
                                                                className={`p-3 rounded-lg border-l-4 ${
                                                                    sentence.type === "positive"
                                                                        ? "bg-green-50 border-green-400"
                                                                        : sentence.type === "warning"
                                                                            ? "bg-yellow-50 border-yellow-400"
                                                                            : "bg-red-50 border-red-400"
                                                                }`}
                                                            >
                                                                <div className="text-sm italic mb-2">"{sentence.text.substring(0, 100)}..."</div>
                                                                <div className="text-sm font-medium mb-1">Feedback:</div>
                                                                <div className="text-sm text-gray-700">{sentence.feedback}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="metadata" className="space-y-4">
                                                {testResults.metadata && (
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <strong>Assessment Type:</strong>
                                                                <div className="text-gray-600">
                                                                    {selectedType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <strong>Word Count:</strong>
                                                                <div className="text-gray-600">{testResults.metadata.totalWords}</div>
                                                            </div>
                                                            <div>
                                                                <strong>Assessed At:</strong>
                                                                <div className="text-gray-600">
                                                                    {new Date(testResults.metadata.assessedAt).toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <strong>Selections:</strong>
                                                                <div className="text-gray-600">{testResults.metadata.selectionsCount}</div>
                                                            </div>
                                                        </div>

                                                        <div className="p-3 bg-gray-50 rounded-lg">
                                                            <strong className="text-sm">Custom Rubric Used:</strong>
                                                            <div className="text-xs text-gray-600 mt-1 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                                                                {customRubric.substring(0, 200)}
                                                                {customRubric.length > 200 ? "..." : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </TabsContent>
                                        </Tabs>
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
