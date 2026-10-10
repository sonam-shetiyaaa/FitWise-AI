export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
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
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }
    const { message, image, history = [], userContext = {} } = body || {};

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const apiKey = (
      req.headers['x-gemini-key'] ||
      process.env.GEMINI_API_KEY ||
      process.env.gemini_api_key ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.vite_gemini_api_key ||
      ""
    ).trim();

    if (!apiKey) {
      return res.status(200).json({
        reply: null,
        error: 'No GEMINI_API_KEY configured'
      });
    }

    // Models to try in order (prioritizing responsive, high-quota models)
    const modelsToTry = [
      process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-3.5-flash",
      "gemini-3.8-flash"
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

    const systemInstruction = `You are FitWise AI, an advanced, highly intelligent, and versatile AI coach and assistant—matching the breadth, depth, and conversational fluency of ChatGPT and Google Gemini.

You are equipped with universal knowledge across all topics and disciplines:
- General Knowledge, Science, Physics, Chemistry, Biology, Astronomy, Math, and History.
- Technology, Programming, Computer Science, Web Development, and Digital Tools.
- Human Physiology, Anatomy, Neuroscience, Sleep Medicine, Circadian Biology, and Stress Management.
- Workouts, Strength & Conditioning, Hypertrophy, Biomechanics, Calisthenics, Running, and Injury Rehabilitation.
- Nutrition, Dietetics, Metabolism, Macronutrients, Micronutrients, and Hydration.
- Psychology, Habit Formation, Time Management, Productivity, Focus, Motivation, and Everyday Life.

User Context:
- Name: ${athleteName}
- Primary Goal: ${athleteGoal}
- Dietary Preference: ${userContext.foodPreference || 'Balanced'}
- Activity Level: ${userContext.activityLevel || 'Active'}

Core Directives & Behavioral Tuning:
1. UNIVERSAL SCOPE: Answer ANY question the user asks, regardless of whether it is about fitness, science, coding, history, general curiosity, or daily life. NEVER refuse a question or claim that you only answer fitness questions.
2. STRICT TOPIC RELEVANCE: Answer EXACTLY what the user asks. If the user asks about physics, astronomy, history, programming, workout mechanics, or productivity, give an insightful, thorough answer dedicated to THAT topic. DO NOT force-feed nutrition, macros, calories, or diet advice into answers unless the user specifically asks about food, diet, nutrition, or weight management!
3. WHEN ASKED ABOUT NUTRITION/DIET: Provide evidence-based nutritional guidance, calculating macros/calories when helpful, suggesting wholesome recipes, and respecting dietary preferences.
4. WHEN ASKED ABOUT FITNESS/WORKOUTS: Deliver biomechanically precise instructions, set/rep ranges, targeted muscle heads, tempo, and progressive overload principles.
5. WHEN ASKED ABOUT SCIENCE OR GENERAL KNOWLEDGE: Provide crystal-clear explanations with real-world analogies, accurate principles, and engaging depth.
6. WHEN ANALYZING IMAGES:
   - Food/meal photos: Identify ingredients, estimate calories/macros, and comment on nutritional density.
   - Gym machine/exercise photos: Identify equipment/movement, explain proper biomechanics, pin adjustments, and form cues.
   - General images: Describe and analyze the content accurately and helpfully.
7. TONE & FORMATTING: Warm, encouraging, articulate, and intelligent. Use clean markdown formatting (clear headings, bullet points, bold key terms) so every response is delightful and easy to read.`;

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
