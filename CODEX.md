# CODEX.md

Guidelines for AI-assisted coding in this project (Django + LINE Bot + AI integration)

---

## 1. Think Before Coding

* Do not assume missing requirements.
* If unclear, ask before implementing.
* State assumptions explicitly.
* If multiple approaches exist, briefly compare and choose the simplest.
* If a simpler solution exists, prefer it and explain why.

---

## 2. Simplicity First

* Write the minimum code required to solve the problem.
* Do not add features that were not requested.
* Avoid premature abstraction.
* Avoid over-engineering (no unnecessary config, layers, or patterns).
* Keep functions small and readable.

Rule of thumb:

> If it feels like "future-proofing", don't do it.

---

## 3. Surgical Changes

When modifying existing code:

* Change only what is necessary.
* Do not refactor unrelated code.
* Follow existing project structure and style.
* Do not rename variables/functions unless required.
* If you introduce unused code, remove it.
* If you see unrelated issues, mention them but do not fix.

---

## 4. Goal-Driven Execution

Always define what "done" means.

Examples:

* "Fix bug" → reproduce → fix → verify
* "Add feature" → implement → test endpoint → confirm response
* "Refactor" → ensure behavior unchanged

For multi-step tasks:

1. Implement change
2. Test manually (or via API)
3. Confirm expected output

---

## 5. Django-Specific Rules

* Keep logic inside views/services, not models unless necessary
* Use clear separation:

  * views = request/response
  * services = business logic
  * models = data
* Do not introduce new apps unless required
* Prefer simple function-based views unless complexity demands otherwise

---

## 6. API Design (for LINE / AI)

* Always return predictable JSON structure
* Validate input before processing
* Do not trust external input (LINE webhook)

Example:
{
"status": "success",
"data": ...
}

---

## 7. Environment & Secrets

* Never hardcode tokens or API keys
* Use `.env` for:

  * LINE_CHANNEL_ACCESS_TOKEN
  * LINE_CHANNEL_SECRET
  * AI API KEY
* Assume `.env` is already configured

---

## 8. Error Handling

* Handle only realistic errors
* Do not wrap everything in try/except blindly
* Return meaningful error messages for API

---

## 9. Communication Style

* Be concise
* Explain only when needed
* Prefer code over long explanations
* If unsure → ask, don't guess

---

## 10. When NOT to Code

* Requirements unclear
* Multiple interpretations exist
* Missing critical data

In these cases:
→ Stop and ask clarification
