import { InferenceClient } from '@huggingface/inference';

// Supported AI image generation models
const SUPPORTED_MODELS = {
  'flux-schnell': {
    id: 'black-forest-labs/FLUX.1-schnell',
    steps: 4,
  },
  'flux-dev': {
    id: 'black-forest-labs/FLUX.1-dev',
    steps: 20,
  },
  'sdxl': {
    id: 'stabilityai/stable-diffusion-xl-base-1.0',
    steps: 30,
  },
  'sd-3.5': {
    id: 'stabilityai/stable-diffusion-3.5-large',
    steps: 28,
  },
};

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
    const modelKey = body?.model || 'flux-schnell';
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const modelConfig = SUPPORTED_MODELS[modelKey];
    if (!modelConfig) {
      return res.status(400).json({ error: 'Unsupported model: ' + modelKey });
    }

    const hfToken = process.env.VITE_HF_TOKEN || process.env.HF_TOKEN;
    
    if (!hfToken) {
      return res.status(500).json({ error: 'HF token not configured' });
    }

    console.log(`Generating image with model [${modelConfig.id}] for prompt:`, prompt);

    // Use the new Hugging Face Inference Providers SDK
    // (the old api-inference.huggingface.co endpoint was deprecated in July 2026)
    const client = new InferenceClient(hfToken);

    const imageBlob = await client.textToImage({
      model: modelConfig.id,
      inputs: prompt,
      parameters: {
        num_inference_steps: modelConfig.steps,
      }
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = imageBlob.type || 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.status(200).send(buffer);
    
  } catch (error) {
    console.error("Serverless error:", error);
    
    // Provide more helpful error messages
    const message = error.message || 'Unknown error';
    if (message.includes('402') || message.includes('credit')) {
      return res.status(402).json({ error: 'Hết credit Hugging Face. Vui lòng nạp thêm hoặc nâng cấp tài khoản HF.' });
    }
    if (message.includes('401') || message.includes('Unauthorized')) {
      return res.status(401).json({ error: 'Token HF không hợp lệ hoặc đã hết hạn.' });
    }
    
    return res.status(500).json({ error: 'Server error: ' + message });
  }
}
