export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-gemini-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, image, history = [], userContext = {} } = req.body || {};

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const apiKey = (
      req.headers['x-gemini-key'] ||
      process.env.GEMINI_API_KEY ||
      ""
    ).trim();

    if (!apiKey) {
      return res.status(200).json({
        reply: null,
        error: 'No GEMINI_API_KEY configured'
      });
    }

    // Models to try in order (prioritizing high-quota models)
    const modelsToTry = [
      process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
      "gemini-flash-latest",
      "gemini-3.5-flash"
    ];
    const uniqueModels = [...new Set(modelsToTry)];

    // Build history
    const validHistory = Array.isArray(history)
      ? history
          .filter(h => h.text && (h.role === 'user' || h.role === 'model'))
          .slice(-10)
          .map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          }))
      : [];

    // Build user parts
    const userParts = [];
    const userText = (message || '').trim() || (image ? 'Please analyze this fitness or nutrition image in detail.' : '');
    userParts.push({ text: userText });

    if (image && image.base64 && image.mimeType) {
      userParts.push({
        inline_data: {
          mime_type: image.mimeType,
          data: image.base64
        }
      });
    }

    const contents = [
      ...validHistory,
      {
        role: 'user',
        parts: userParts
      }
    ];

    const athleteName = userContext.name || 'Athlete';
    const athleteGoal = userContext.fitnessGoal || 'Overall Fitness & Strength';

    const systemInstruction = `You are FitWise AI, an expert, personalized, and articulate AI health, fitness, nutrition, and wellness coach—delivering answers with the quality, intelligence, and depth of ChatGPT and Google Gemini.

Athlete Context:
- Name: ${athleteName}
- Primary Goal: ${athleteGoal}
- Dietary Preference: ${userContext.foodPreference || 'Balanced'}
- Activity Level: ${userContext.activityLevel || 'Active'}

Guidelines:
1. Directly and specifically answer EXACTLY what the user asks. Never give generic boilerplate.
2. If asked about workouts, exercises, or anatomy: provide clear biomechanical cues, set/rep ranges, target muscle heads, and progression tips.
3. If asked about diet, nutrition, or macros: provide concrete numbers (calories, grams of protein/carbs/fat), food suggestions, and meal timing.
4. If asked about recovery, soreness, sleep, or mindset: give science-backed practical advice with genuine human warmth.
5. If analyzing an image: break down the foods, estimate calories/macros, or identify the gym equipment with proper form cues.
6. Use clean, beautiful Markdown formatting with clear headings, bullet points, and bold emphasis for effortless reading.`;

    for (const model of uniqueModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const restResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            contents
          })
        });

        if (restResponse.ok) {
          const data = await restResponse.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.json({
              reply: text,
              source: `gemini-cloud (${model})`
            });
          }
        }
      } catch (err) {
        // Try next model
      }
    }

    return res.status(200).json({
      reply: null,
      error: 'Gemini models were unavailable'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
