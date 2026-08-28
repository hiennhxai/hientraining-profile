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
    const image = body?.image;
    
    if (!prompt || !image) {
      return res.status(400).json({ error: 'Prompt and image are required' });
    }

    console.log(`Editing image with Modal Serverless for prompt:`, prompt);
    const url = `https://hiennhxai--flux-schnell-api-editmodel-edit.modal.run`;
    
    const modalRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, image })
    });
    
    if (!modalRes.ok) {
       const errText = await modalRes.text();
       throw new Error(`Modal Edit API error: ${modalRes.status} ${errText}`);
    }
    
    const arrayBuffer = await modalRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.status(200).send(buffer);
    
  } catch (error) {
    console.error("Edit Serverless error:", error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
