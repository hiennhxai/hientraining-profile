import https from 'https';

export default async function handler(req, res) {
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
      return res.status(500).json({ error: 'Hugging Face API token is not configured on the server' });
    }

    console.log("Generating image for prompt:", prompt);

    const postData = JSON.stringify({ inputs: prompt });

    const options = {
      hostname: 'api-inference.huggingface.co',
      port: 443,
      path: '/models/black-forest-labs/FLUX.1-schnell',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const hfResponse = await new Promise((resolve, reject) => {
      const hfReq = https.request(options, (hfRes) => {
        const chunks = [];
        hfRes.on('data', (chunk) => chunks.push(chunk));
        hfRes.on('end', () => {
          resolve({
            ok: hfRes.statusCode >= 200 && hfRes.statusCode < 300,
            status: hfRes.statusCode,
            headers: hfRes.headers,
            buffer: Buffer.concat(chunks)
          });
        });
      });
      
      hfReq.on('error', (e) => reject(e));
      hfReq.write(postData);
      hfReq.end();
    });

    if (!hfResponse.ok) {
      const errorText = hfResponse.buffer.toString('utf8');
      console.error("HF Error:", hfResponse.status, errorText);
      return res.status(hfResponse.status).json({ error: 'Hugging Face API error', details: errorText });
    }

    const buffer = hfResponse.buffer;
    const contentType = hfResponse.headers['content-type'] || 'image/jpeg';

    // Return the binary image directly to the client
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.status(200).send(buffer);
    
  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'Server error: ' + error.message, details: error.stack });
  }
}
