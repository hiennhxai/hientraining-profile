export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const prompt = body?.prompt;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const hfToken = process.env.VITE_HF_TOKEN || process.env.HF_TOKEN;
    
    if (!hfToken) {
      return res.status(500).json({ error: 'HF token not configured' });
    }

    console.log("Generating image for prompt:", prompt);

    // Use global fetch (available in Vercel Node 18+)
    const hfResponse = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("HF Error:", hfResponse.status, errorText);
      return res.status(hfResponse.status).json({ error: 'HF API error: ' + hfResponse.status, details: errorText });
    }

    const arrayBuffer = await hfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = hfResponse.headers.get('content-type') || 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.status(200).send(buffer);
    
  } catch (error) {
    console.error("Serverless error:", error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
