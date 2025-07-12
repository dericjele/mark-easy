// Popup script for the Chrome extension
document.addEventListener("DOMContentLoaded", () => {
    const openPanelBtn = document.getElementById("open-panel")
    const clearCacheBtn = document.getElementById("clear-cache")
    const settingsBtn = document.getElementById("settings")
    const cachedCountEl = document.getElementById("cached-count")
    const rubricToggle = document.getElementById("rubric-toggle")
    const rubricContent = document.getElementById("rubric-content")
    const rubricTextarea = document.getElementById("rubric-textarea")
    const assignmentTypeEl = document.getElementById("assignment-type")

    // Declare chrome variable
    const chrome = window.chrome

    // Load cached data and rubric
    chrome.storage.local.get(["cachedSelections", "customRubric", "assignmentType"], (result) => {
        const count = result.cachedSelections ? result.cachedSelections.length : 0
        cachedCountEl.textContent = count

        if (result.customRubric) {
            rubricTextarea.value = result.customRubric
        }

        if (result.assignmentType) {
            assignmentTypeEl.textContent = result.assignmentType
            // Highlight the active preset
            document.querySelectorAll(".preset-btn").forEach((btn) => {
                btn.classList.toggle("active", btn.dataset.type === result.assignmentType)
            })
        }
    })

    // Rubric toggle functionality
    rubricToggle.addEventListener("click", () => {
        const isExpanded = rubricContent.classList.contains("expanded")
        const toggle = rubricToggle.querySelector(".rubric-toggle")

        if (isExpanded) {
            rubricContent.classList.remove("expanded")
            toggle.classList.remove("expanded")
        } else {
            rubricContent.classList.add("expanded")
            toggle.classList.add("expanded")
        }
    })

    // Preset buttons
    document.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"))
            // Add active class to clicked button
            btn.classList.add("active")

            const type = btn.dataset.type
            assignmentTypeEl.textContent = type.replace("-", " ")

            // Set preset rubric text
            const presets = {
                essay: `Focus on:
• Thesis statement clarity and strength
• Logical flow and organization of arguments
• Use of evidence and examples
• Grammar, spelling, and sentence structure
• Conclusion effectiveness
• Overall coherence and clarity`,
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

            rubricTextarea.value = presets[type] || ""

            // Save to storage
            chrome.storage.local.set({
                assignmentType: type,
                customRubric: rubricTextarea.value,
            })
        })
    })

    // Save rubric on change
    rubricTextarea.addEventListener("input", () => {
        chrome.storage.local.set({ customRubric: rubricTextarea.value })
    })

    // Open assessment panel
    openPanelBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "openAssessmentPanel",
            })
            window.close()
        })
    })

    // Clear cache
    clearCacheBtn.addEventListener("click", () => {
        chrome.storage.local.remove(["cachedSelections"], () => {
            cachedCountEl.textContent = "0"
        })
    })

    // Settings (placeholder)
    settingsBtn.addEventListener("click", () => {
        console.log("Settings clicked")
    })

    // Update current page info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = new URL(tabs[0].url)
        document.getElementById("current-page").textContent = url.hostname
    })
})
