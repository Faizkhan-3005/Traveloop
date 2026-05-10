const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const generateTripPlan = async (req, res, next) => {
  try {
    const { destination, budget, travelers, style, duration, interests, transport, mode } = req.body

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "AI Configuration missing (API Key). Please contact support." })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
      Act as an expert travel planner. Create a detailed, premium travel itinerary for ${duration} days in ${destination}.
      
      User Details:
      - Travelers: ${travelers}
      - Budget: ${budget} (Mode: ${mode})
      - Style: ${style}
      - Interests: ${interests}
      - Transport: ${transport}

      Return ONLY a JSON object with the following structure:
      {
        "title": "A catchy title for the trip",
        "description": "Short summary of the trip",
        "weather": "Brief weather insight",
        "itinerary": [
          {
            "day": 1,
            "summary": "Focus for the day",
            "activities": [
              { "time": "9:00 AM", "name": "Activity Name", "description": "Brief description", "cost": "Estimated cost" }
            ]
          }
        ],
        "packingSuggestions": ["item 1", "item 2"],
        "localFood": ["dish 1", "dish 2"],
        "travelTips": ["tip 1", "tip 2"],
        "estimatedTotalCost": "String value"
      }

      Requirements:
      - Be realistic about travel times.
      - Match the user's travel style and interests.
      - Ensure the budget mode (${mode}) is respected.
      - Do not include any text before or after the JSON.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean up text more aggressively
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    // Attempt to extract JSON if it's wrapped in conversational text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) text = jsonMatch[0]

    try {
      const plan = JSON.parse(text)
      
      // Basic validation of required fields to prevent frontend crashes
      if (!plan.itinerary || !Array.isArray(plan.itinerary)) {
        throw new Error("Invalid itinerary structure")
      }

      return res.json(plan)
    } catch (parseError) {
      console.error("[GEMINI PARSE ERROR]", text)
      return res.status(500).json({ 
        message: "AI generated a non-standard response. Please refine your prompt or try again.", 
        error: parseError.message 
      })
    }
  } catch (error) {
    // Handle Gemini Quota/Rate Limit Errors
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({ message: "Rate limit exceeded. Please wait a moment." })
    }
    return next(error)
  }
}

module.exports = { generateTripPlan }
