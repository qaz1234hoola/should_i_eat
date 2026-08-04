import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { ingredients, user_condition } = await req.json();

    if (!ingredients || !user_condition) {
      return NextResponse.json({ error: 'Missing ingredients or condition input.' }, { status: 400 });
    }

    const prompt = `
    Target Health Condition/Requirement: ${user_condition}
    Ingredients List: ${ingredients.join(', ')}

    Analyze these food ingredients specifically for someone with this health condition.
    Return ONLY a valid JSON object with this EXACT structure:

    {
      "user_condition": "${user_condition}",
      "recommendation": "Safe to Eat | Limit / Exercise Caution | Strictly Avoid",
      "explanation": "Clear, simple explanation linking ingredients to this condition",
      "flagged_ingredients": ["Ingredient name 1", "Ingredient name 2"],
      "actionable_advice": "Practical advice for the user"
    }
    `;

    // Send request to Groq's Fast Text Model
    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const parsedData = JSON.parse(response.choices[0].message.content);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Groq Condition Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze health condition.' }, { status: 500 });
  }
}