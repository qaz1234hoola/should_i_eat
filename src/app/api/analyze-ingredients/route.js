import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Convert uploaded image file to a Base64 data string
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    const prompt = `
    You are a food science expert. Analyze the provided image of an ingredient label.

    Instructions:
        1. Read all listed ingredients accurately from the image.
        2. Explain each ingredient in simple, 7th-grade English.
        3. State pros, cons, regular safe limits, and if it belongs in this product type.
        4. Provide an overall quality rating (Green, Yellow, or Red) with a short headline and summary.
    Extract all listed ingredients and return ONLY a valid JSON object matching this EXACT structure:

    {
      "product_category": "Type of product (e.g., Breakfast Cereal, Snack)",
      "verdict": {
        "overall_rating": "Green", "Yellow", or "Red",
        "headline": "Short catchphrase summary",
        "summary": "Simple 1-2 sentence overview of product quality"
      },
      "ingredients": [
        {
          "name": "Ingredient name",
          "what_it_is": "Simple plain English explanation",
          "pros": ["Benefit 1", "Benefit 2"],
          "cons": ["Concern 1", "Concern 2"],
          "safe_consumption_limit": "Safe daily limit or risk threshold",
          "is_ok_in_this_product": "Makes sense / Red flag / Filler"
        }
      ]
    }
    `;

    // Send request to Groq's Vision Model
    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' }
    });

    const parsedData = JSON.parse(response.choices[0].message.content);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Groq Ingredient Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze label image.' }, { status: 500 });
  }
}
