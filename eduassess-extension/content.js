// Content script that runs on all pages
;(() => {
    let selectedText = ""
    let selectionPopover = null
    let assessmentPanel = null
    let cachedSelections = []
    let customRubric = ""
    let assignmentType = "auto-detect"
    let isDragging = false
    const dragOffset = { x: 0, y: 0 }
    const chrome = window.chrome // Declare the chrome variable

    // Debug logging
    console.log("🎓 EduAssess AI: Content script loaded")

    // Load cached selections and rubric from storage
    chrome.storage.local.get(["cachedSelections", "customRubric", "assignmentType"], (result) => {
        cachedSelections = result.cachedSelections || []
        customRubric = result.customRubric || ""
        assignmentType = result.assignmentType || "auto-detect"
        console.log("📚 Loaded cached selections:", cachedSelections.length)
        console.log("📋 Loaded custom rubric:", customRubric.length, "characters")
    })

    // Text selection handler
    document.addEventListener("mouseup", (e) => {
        const selection = window.getSelection()
        const text = selection.toString().trim()

        console.log("🖱️ Text selected:", text.length, "characters")

        // Don't show popover for our own UI elements
        if (
            e.target.closest(".eduassess-popover") ||
            e.target.closest(".eduassess-panel") ||
            e.target.closest(".eduassess-notification") ||
            e.target.closest(".eduassess-error")
        ) {
            return
        }

        if (text.length > 10) {
            // Only show for meaningful selections
            selectedText = text
            console.log("✅ Showing popover for text:", text.substring(0, 50) + "...")
            showSelectionPopover(e.pageX, e.pageY)
        } else {
            hideSelectionPopover()
        }
    })

    // Hide popover when clicking elsewhere
    document.addEventListener("mousedown", (e) => {
        if (selectionPopover && !selectionPopover.contains(e.target)) {
            hideSelectionPopover()
        }
    })

    function showSelectionPopover(x, y) {
        hideSelectionPopover()

        console.log("🎯 Creating popover at position:", x, y)

        selectionPopover = document.createElement("div")
        selectionPopover.className = "eduassess-popover"
        selectionPopover.innerHTML = `
      <div class="eduassess-popover-content">
        <div class="eduassess-header">
          <div class="eduassess-status">
            <div class="eduassess-pulse"></div>
            <span>Text Selected</span>
            <span class="eduassess-badge">${selectedText.length} chars</span>
          </div>
        </div>
        
        <div class="eduassess-preview">
          "${selectedText.substring(0, 100)}${selectedText.length > 100 ? "..." : ""}"
        </div>
        
        <div class="eduassess-actions">
          <button class="eduassess-btn eduassess-btn-primary" id="assess-now-${Date.now()}">
            <span class="eduassess-icon">🧠</span>
            Assess Now
          </button>
          <button class="eduassess-btn eduassess-btn-secondary" id="cache-selection-${Date.now()}">
            <span class="eduassess-icon">📌</span>
            Cache (${cachedSelections.length})
          </button>
        </div>
        
        <div class="eduassess-footer">
          <span>Assignment Type:</span>
          <span class="eduassess-type-badge">${assignmentType.replace("-", " ")}</span>
        </div>
      </div>
    `

        // Position the popover
        selectionPopover.style.position = "absolute"
        selectionPopover.style.left = Math.min(x, window.innerWidth - 320) + "px"
        selectionPopover.style.top = y - 10 + "px"
        selectionPopover.style.zIndex = "10000"

        document.body.appendChild(selectionPopover)

        // Add event listeners with unique IDs
        const assessButton = selectionPopover.querySelector('[id^="assess-now-"]')
        const cacheButton = selectionPopover.querySelector('[id^="cache-selection-"]')

        if (assessButton) {
            assessButton.addEventListener("click", (e) => {
                console.log("🧠 Assess Now clicked!")
                e.preventDefault()
                e.stopPropagation()
                assessText(selectedText)
                hideSelectionPopover()
            })
        }

        if (cacheButton) {
            cacheButton.addEventListener("click", (e) => {
                console.log("📌 Cache clicked!")
                e.preventDefault()
                e.stopPropagation()
                cacheSelection(selectedText)
                hideSelectionPopover()
            })
        }
    }

    function hideSelectionPopover() {
        if (selectionPopover) {
            console.log("❌ Hiding popover")
            selectionPopover.remove()
            selectionPopover = null
        }
    }

    function cacheSelection(text) {
        console.log("💾 Caching selection:", text.substring(0, 50) + "...")

        const selection = {
            text: text,
            timestamp: Date.now(),
            url: window.location.href,
            title: document.title,
        }

        cachedSelections.push(selection)
        chrome.storage.local.set({ cachedSelections: cachedSelections })

        // Show confirmation
        showNotification("Selection cached successfully!")
    }

    function assessText(text) {
        console.log("🔍 Starting assessment for text:", text.substring(0, 50) + "...")

        // Create selection object
        const selection = {
            text: text,
            timestamp: Date.now(),
            url: window.location.href,
            title: document.title,
        }

        // Open the assessment panel with the selected text
        openAssessmentPanel([selection])
    }

    function openAssessmentPanel(selections = null) {
        console.log("📊 Opening assessment panel")

        if (assessmentPanel) {
            assessmentPanel.remove()
        }

        const selectionsToAssess = selections || cachedSelections
        console.log("📝 Assessing selections:", selectionsToAssess.length, selectionsToAssess)

        // Validate we have selections
        if (!selectionsToAssess || selectionsToAssess.length === 0) {
            console.error("❌ No selections to assess")
            showError("No content selected for assessment")
            return
        }

        assessmentPanel = document.createElement("div")
        assessmentPanel.className = "eduassess-panel"
        assessmentPanel.innerHTML = `
      <div class="eduassess-panel-content">
        <div class="eduassess-panel-header" id="panel-header">
          <div class="eduassess-panel-title">
            <div class="eduassess-logo">EA</div>
            <div>
              <h2>EduAssess AI</h2>
              <p>Intelligent Assignment Assessment</p>
            </div>
          </div>
          <div class="eduassess-panel-controls">
            <button class="eduassess-control-btn" id="minimize-panel" title="Minimize">−</button>
            <button class="eduassess-control-btn" id="drag-handle" title="Drag to move">⋮⋮</button>
            <button class="eduassess-close" id="close-panel">×</button>
          </div>
        </div>
        
        <div class="eduassess-panel-body" id="panel-body">
          <div class="eduassess-loading">
            <div class="eduassess-spinner"></div>
            <p>Analyzing your content with AI...</p>
            <p style="font-size: 12px; color: #666;">Processing ${selectionsToAssess.length} selection(s)</p>
            <p style="font-size: 10px; color: #999;">Total words: ${selectionsToAssess.reduce((acc, sel) => acc + sel.text.split(" ").length, 0)}</p>
            ${customRubric ? `<p style="font-size: 10px; color: #999;">Using custom rubric (${assignmentType})</p>` : ""}
          </div>
        </div>
      </div>
    `

        // Position panel (default to right side)
        assessmentPanel.style.position = "fixed"
        assessmentPanel.style.top = "20px"
        assessmentPanel.style.right = "20px"
        assessmentPanel.style.zIndex = "10001"

        document.body.appendChild(assessmentPanel)

        // Make panel draggable
        setupDraggable()

        // Event listeners
        document.getElementById("close-panel").addEventListener("click", () => {
            console.log("❌ Closing assessment panel")
            assessmentPanel.remove()
            assessmentPanel = null
        })

        document.getElementById("minimize-panel").addEventListener("click", () => {
            const panelBody = document.getElementById("panel-body")
            const minimizeBtn = document.getElementById("minimize-panel")

            if (panelBody.style.display === "none") {
                panelBody.style.display = "block"
                minimizeBtn.textContent = "−"
                minimizeBtn.title = "Minimize"
            } else {
                panelBody.style.display = "none"
                minimizeBtn.textContent = "+"
                minimizeBtn.title = "Expand"
            }
        })

        // Start assessment
        performAssessment(selectionsToAssess)
    }

    function setupDraggable() {
        const header = document.getElementById("panel-header")
        const dragHandle = document.getElementById("drag-handle")

        let startX, startY, startLeft, startTop

        const startDrag = (e) => {
            isDragging = true
            startX = e.clientX
            startY = e.clientY

            const rect = assessmentPanel.getBoundingClientRect()
            startLeft = rect.left
            startTop = rect.top

            assessmentPanel.style.cursor = "grabbing"
            header.style.cursor = "grabbing"

            // Prevent text selection during drag
            document.body.style.userSelect = "none"

            document.addEventListener("mousemove", drag)
            document.addEventListener("mouseup", stopDrag)

            e.preventDefault()
        }

        const drag = (e) => {
            if (!isDragging) return

            const deltaX = e.clientX - startX
            const deltaY = e.clientY - startY

            const newLeft = Math.max(0, Math.min(window.innerWidth - assessmentPanel.offsetWidth, startLeft + deltaX))
            const newTop = Math.max(0, Math.min(window.innerHeight - assessmentPanel.offsetHeight, startTop + deltaY))

            assessmentPanel.style.left = newLeft + "px"
            assessmentPanel.style.top = newTop + "px"
            assessmentPanel.style.right = "auto"
            assessmentPanel.style.bottom = "auto"
        }

        const stopDrag = () => {
            isDragging = false
            assessmentPanel.style.cursor = "default"
            header.style.cursor = "grab"
            document.body.style.userSelect = ""

            document.removeEventListener("mousemove", drag)
            document.removeEventListener("mouseup", stopDrag)
        }

        // Make header draggable
        header.addEventListener("mousedown", startDrag)
        dragHandle.addEventListener("mousedown", startDrag)

        // Set initial cursor
        header.style.cursor = "grab"
        dragHandle.style.cursor = "grab"
    }

    async function performAssessment(selections) {
        console.log("🚀 Starting API call to assess content")

        try {
            const requestBody = {
                selections: selections,
                assignmentType: assignmentType === "auto-detect" ? "essay" : assignmentType,
                educationLevel: "high-school",
                focusAreas: ["grammar", "structure", "content"],
                customRubric: customRubric,
            }

            console.log("📤 Sending request:", requestBody)

            // Try different API URLs in case of CORS issues
            const apiUrls = ["http://localhost:3000/api/assess", "http://127.0.0.1:3000/api/assess"]

            let response = null
            let lastError = null

            for (const apiUrl of apiUrls) {
                try {
                    console.log("🔗 Trying API URL:", apiUrl)

                    response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(requestBody),
                        mode: "cors", // Explicitly set CORS mode
                    })

                    console.log("📥 Response status:", response.status, "from", apiUrl)

                    if (response.ok) {
                        break // Success, exit the loop
                    } else {
                        const errorText = await response.text()
                        console.error("❌ API Error:", response.status, errorText)
                        lastError = new Error(`API Error: ${response.status} - ${errorText}`)
                    }
                } catch (fetchError) {
                    console.error("❌ Fetch Error for", apiUrl, ":", fetchError)
                    lastError = fetchError
                    continue // Try next URL
                }
            }

            if (!response || !response.ok) {
                throw lastError || new Error("All API endpoints failed")
            }

            const result = await response.json()
            console.log("✅ Assessment result:", result)

            displayAssessmentResults(result)
        } catch (error) {
            console.error("💥 Assessment failed:", error)
            showError(`Failed to assess content: ${error.message}`)

            // Show detailed error in panel
            if (assessmentPanel) {
                const panelBody = assessmentPanel.querySelector(".eduassess-panel-body")
                panelBody.innerHTML = `
          <div class="eduassess-error-panel">
            <h3>❌ Assessment Failed</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <div class="eduassess-debug">
              <details>
                <summary>Troubleshooting Tips</summary>
                <ul style="text-align: left; font-size: 12px; color: #666;">
                  <li>Make sure your Next.js API is running on <code>http://localhost:3000</code></li>
                  <li>Check if you can access <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> in your browser</li>
                  <li>Verify your Grok API key is set in <code>.env.local</code></li>
                  <li>Check the browser console for CORS errors</li>
                </ul>
              </details>
            </div>
            <button class="eduassess-btn eduassess-btn-secondary" onclick="location.reload()">
              Refresh Page
            </button>
          </div>
        `
            }
        }
    }

    function displayAssessmentResults(results) {
        console.log("🎨 Displaying results")

        const panelBody = assessmentPanel.querySelector(".eduassess-panel-body")

        if (!results.overall) {
            console.error("❌ Invalid results structure:", results)
            showError("Invalid assessment results received")
            return
        }

        const isEssay = assignmentType === "essay"
        const hasDetection = isEssay && (results.ai_detection || results.plagiarism_check)

        panelBody.innerHTML = `
    <div class="eduassess-results">
      <!-- Main Score Display -->
      <div class="eduassess-main-scores">
        <div class="eduassess-grade-circle">
          <div class="eduassess-grade-score">${results.overall.score}%</div>
          <div class="eduassess-grade-letter">${results.overall.grade}</div>
          <div class="eduassess-grade-label">Overall Grade</div>
        </div>
        
        ${
            hasDetection
                ? `
          <div class="eduassess-detection-scores">
            ${
                    results.ai_detection
                        ? `
              <div class="eduassess-detection-item ${results.ai_detection.risk_level}">
                <div class="eduassess-detection-icon">🤖</div>
                <div class="eduassess-detection-score">${results.ai_detection.score}%</div>
                <div class="eduassess-detection-label">AI Detection</div>
                <div class="eduassess-detection-risk">${results.ai_detection.risk_level} risk</div>
              </div>
            `
                        : ""
                }
            
            ${
                    results.plagiarism_check
                        ? `
              <div class="eduassess-detection-item ${results.plagiarism_check.risk_level}">
                <div class="eduassess-detection-icon">📄</div>
                <div class="eduassess-detection-score">${results.plagiarism_check.score}%</div>
                <div class="eduassess-detection-label">Plagiarism</div>
                <div class="eduassess-detection-risk">${results.plagiarism_check.risk_level} risk</div>
                ${results.plagiarism_check.source_count > 0 ? `<div class="eduassess-detection-sources">${results.plagiarism_check.source_count} sources</div>` : ""}
              </div>
            `
                        : ""
                }
          </div>
        `
                : ""
        }
      </div>

      <!-- High Risk Warnings -->
      ${
            hasDetection &&
            (
                (results.ai_detection && results.ai_detection.score > 70) ||
                (results.plagiarism_check && results.plagiarism_check.score > 70)
            )
                ? `
        <div class="eduassess-warnings">
          ${
                    results.ai_detection && results.ai_detection.score > 70
                        ? `
            <div class="eduassess-warning ai-warning">
              <div class="eduassess-warning-icon">🚨</div>
              <div class="eduassess-warning-content">
                <strong>High AI Usage Detected (${results.ai_detection.score}%)</strong>
                <p>This submission appears to be largely AI-generated. Consider discussing academic integrity policies.</p>
              </div>
            </div>
          `
                        : ""
                }
          
          ${
                    results.plagiarism_check && results.plagiarism_check.score > 70
                        ? `
            <div class="eduassess-warning plagiarism-warning">
              <div class="eduassess-warning-icon">🚨</div>
              <div class="eduassess-warning-content">
                <strong>High Plagiarism Risk (${results.plagiarism_check.score}%)</strong>
                <p>Strong indicators of plagiarized content detected. ${results.plagiarism_check.source_count > 0 ? `${results.plagiarism_check.source_count} potential sources found.` : ""}</p>
              </div>
            </div>
          `
                        : ""
                }
        </div>
      `
                : ""
        }

      <!-- Tab Navigation -->
      <div class="eduassess-tabs">
        <button class="eduassess-tab active" data-tab="feedback">📝 Feedback</button>
        <button class="eduassess-tab" data-tab="detailed">🔍 Detailed</button>
        <button class="eduassess-tab" data-tab="info">ℹ️ Info</button>
      </div>

      <!-- Feedback Tab -->
      <div class="eduassess-tab-content active" id="feedback-content">
        <div class="eduassess-feedback-grid">
          <div class="eduassess-feedback-section strengths">
            <h4>✅ Strengths</h4>
            <ul>
              ${results.overall.strengths.map((s) => `<li>${s}</li>`).join("")}
            </ul>
          </div>
          
          <div class="eduassess-feedback-section improvements">
            <h4>⚠️ Areas for Improvement</h4>
            <ul>
              ${results.overall.improvements.map((i) => `<li>${i}</li>`).join("")}
            </ul>
          </div>
          
          ${
            results.recommendations
                ? `
            <div class="eduassess-feedback-section recommendations">
              <h4>💡 Recommendations</h4>
              <ul>
                ${results.recommendations.map((r) => `<li>${r}</li>`).join("")}
              </ul>
            </div>
          `
                : ""
        }
        </div>
      </div>

      <!-- Detailed Tab -->
      <div class="eduassess-tab-content" id="detailed-content">
        ${
            results.detailed_feedback
                ? `
          <div class="eduassess-detailed-grid">
            <div class="eduassess-detail-item">
              <h5>📝 Structure & Organization</h5>
              <p>${results.detailed_feedback.structure}</p>
            </div>
            <div class="eduassess-detail-item">
              <h5>💡 Content & Ideas</h5>
              <p>${results.detailed_feedback.content}</p>
            </div>
            <div class="eduassess-detail-item">
              <h5>✏️ Grammar & Language</h5>
              <p>${results.detailed_feedback.grammar}</p>
            </div>
            ${
                    results.detailed_feedback.citations
                        ? `
              <div class="eduassess-detail-item">
                <h5>📚 Citations & Sources</h5>
                <p>${results.detailed_feedback.citations}</p>
              </div>
            `
                        : ""
                }
          </div>
        `
                : ""
        }
        
        ${
            results.sentences && results.sentences.length > 0
                ? `
          <div class="eduassess-sentences">
            <h4>Sentence Analysis</h4>
            ${results.sentences
                    .slice(0, 3)
                    .map(
                        (sentence, i) => `
              <div class="eduassess-sentence ${sentence.type}">
                <div class="eduassess-sentence-text">"${sentence.text.substring(0, 100)}..."</div>
                <div class="eduassess-sentence-feedback">${sentence.feedback}</div>
              </div>
            `,
                    )
                    .join("")}
          </div>
        `
                : ""
        }
      </div>

      <!-- Info Tab -->
      <div class="eduassess-tab-content" id="info-content">
        <div class="eduassess-info-grid">
          <div class="eduassess-info-item">
            <strong>Word Count:</strong> ${results.metadata?.totalWords || 0}
          </div>
          <div class="eduassess-info-item">
            <strong>Assignment Type:</strong> ${assignmentType.replace("-", " ")}
          </div>
          <div class="eduassess-info-item">
            <strong>Assessed:</strong> ${new Date().toLocaleString()}
          </div>
          ${
            results.metadata?.hasWinstonDetection
                ? `
            <div class="eduassess-info-item">
              <strong>Detection:</strong> Winston AI
            </div>
            <div class="eduassess-info-item">
              <strong>Credits Used:</strong> ${results.metadata.winstonCreditsUsed || 0}
            </div>
          `
                : ""
        }
        </div>
        
        <div class="eduassess-export">
          <button class="eduassess-btn eduassess-btn-secondary" id="export-results">
            📄 Export Results
          </button>
        </div>
      </div>
    </div>
  `

        // Setup tab functionality
        setupTabs(panelBody)

        // Export functionality
        const exportBtn = panelBody.querySelector("#export-results")
        if (exportBtn) {
            exportBtn.addEventListener("click", () => exportResults(results))
        }
    }

    function setupTabs(container) {
        const tabButtons = container.querySelectorAll(".eduassess-tab")
        const tabContents = container.querySelectorAll(".eduassess-tab-content")

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const targetTab = button.dataset.tab

                // Remove active class from all
                tabButtons.forEach((btn) => btn.classList.remove("active"))
                tabContents.forEach((content) => content.classList.remove("active"))

                // Add active class to clicked
                button.classList.add("active")
                const targetContent = container.querySelector(`#${targetTab}-content`)
                if (targetContent) {
                    targetContent.classList.add("active")
                }
            })
        })
    }

    function setupMainTabs(container) {
        const tabButtons = container.querySelectorAll(".eduassess-main-tab")
        const tabContents = container.querySelectorAll(".eduassess-main-tab-content")

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const targetTab = button.dataset.tab

                // Remove active class from all buttons and contents
                tabButtons.forEach((btn) => {
                    btn.classList.remove("active")
                    btn.setAttribute("aria-selected", "false")
                })
                tabContents.forEach((content) => content.classList.remove("active"))

                // Add active class to clicked button and corresponding content
                button.classList.add("active")
                button.setAttribute("aria-selected", "true")
                const targetContent = container.querySelector(`#${targetTab}-content`)
                if (targetContent) {
                    targetContent.classList.add("active")
                }
            })
        })
    }

    function setupDetailedTabs(container) {
        const tabButtons = container.querySelectorAll(".eduassess-tab-btn")
        const tabContents = container.querySelectorAll(".eduassess-tab-content")

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const targetTab = button.dataset.tab

                // Remove active class from all buttons and contents
                tabButtons.forEach((btn) => btn.classList.remove("active"))
                tabContents.forEach((content) => content.classList.remove("active"))

                // Add active class to clicked button and corresponding content
                button.classList.add("active")
                const targetContent = container.querySelector(`#${targetTab}-tab`)
                if (targetContent) {
                    targetContent.classList.add("active")
                }
            })
        })
    }

    function exportResults(results) {
        const exportData = {
            assessment: results,
            metadata: {
                exportedAt: new Date().toISOString(),
                assignmentType: assignmentType,
                customRubric: customRubric,
            },
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `assessment-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        showNotification("Assessment results exported successfully!")
    }

    function showNotification(message) {
        console.log("📢 Notification:", message)

        const notification = document.createElement("div")
        notification.className = "eduassess-notification"
        notification.textContent = message
        document.body.appendChild(notification)

        setTimeout(() => {
            notification.remove()
        }, 3000)
    }

    function showError(message) {
        console.error("🚨 Error:", message)

        const error = document.createElement("div")
        error.className = "eduassess-error"
        error.textContent = message
        document.body.appendChild(error)

        setTimeout(() => {
            error.remove()
        }, 5000)
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("📨 Message received:", request)

        if (request.action === "openAssessmentPanel") {
            openAssessmentPanel()
        }
    })
})()

const style = document.createElement("style")
style.textContent = `
.eduassess-integrity-sources,
.eduassess-integrity-readability {
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
}

.eduassess-provider-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  margin-top: 12px;
  font-size: 12px;
}

.eduassess-provider-label {
  color: #64748b;
}

.eduassess-provider-name {
  font-weight: 600;
  color: #1e293b;
}

.eduassess-credits-used {
  color: #64748b;
  font-size: 10px;
}
`
document.head.appendChild(style)
