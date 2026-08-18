import { InferenceClient } from '@huggingface/inference';

// Tăng thời gian timeout cho Vercel Serverless Function lên 60 giây để chờ Modal Cold Start
export const maxDuration = 60;

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

    // --- CLOUDFLARE WORKERS AI INTEGRATION ---
    if (modelKey === 'cloudflare') {
      const cfAccountId = process.env.CF_ACCOUNT_ID;
      const cfApiToken = process.env.CF_API_TOKEN;
      
      if (!cfAccountId || !cfApiToken) {
        return res.status(500).json({ error: 'Chưa cấu hình API Key cho Cloudflare.' });
      }
      
      console.log(`Generating image with Cloudflare AI for prompt:`, prompt);
      const url = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`;
      
      const cfRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cfApiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
      });
      
      if (!cfRes.ok) {
         const errText = await cfRes.text();
         throw new Error(`Cloudflare API error: ${cfRes.status} ${errText}`);
      }
      
      const arrayBuffer = await cfRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.status(200).send(buffer);
    }
    // ----------------------------------------

    // --- SEGMIND AI INTEGRATION ---
    if (modelKey === 'segmind') {
      const segmindApiKey = process.env.SEGMIND_API_KEY;
      if (!segmindApiKey) {
        return res.status(500).json({ error: 'Chưa cấu hình API Key cho Segmind. Vui lòng thêm SEGMIND_API_KEY vào biến môi trường.' });
      }
      
      console.log(`Generating image with Segmind AI for prompt:`, prompt);
      const url = `https://api.segmind.com/v1/fast-flux-schnell`;
      
      const segRes = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': segmindApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: prompt,
          steps: 4,
          seed: Math.floor(Math.random() * 1000000),
          aspect_ratio: "1:1"
        })
      });
      
      if (!segRes.ok) {
         const errText = await segRes.text();
         throw new Error(`Segmind API error: ${segRes.status} ${errText}`);
      }
      
      const arrayBuffer = await segRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.status(200).send(buffer);
    }
    // ----------------------------------------

    // --- MODAL AI INTEGRATION ---
    if (modelKey === 'modal-h100' || modelKey === 'modal-t4') {
      const gpuName = modelKey === 'modal-h100' ? 'H100' : 'T4';
      console.log(`Generating image with Modal Serverless GPU (${gpuName}) for prompt:`, prompt);
      const url = modelKey === 'modal-h100' 
         ? `https://hiennhxai--flux-schnell-api-fluxmodelh100-generate.modal.run`
         : `https://hiennhxai--flux-schnell-api-fluxmodelt4-generate.modal.run`;
      
      const modalRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
      });
      
      if (!modalRes.ok) {
         const errText = await modalRes.text();
         throw new Error(`Modal API error: ${modalRes.status} ${errText}`);
      }
      
      const arrayBuffer = await modalRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.status(200).send(buffer);
    }
    // ----------------------------------------

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
    
    if (message.includes('Segmind')) {
       if (message.includes('402') || message.includes('credit') || message.includes('400')) {
         return res.status(402).json({ error: 'Lỗi Segmind AI: Hết credit hoặc tài khoản Segmind bị giới hạn. Vui lòng kiểm tra lại.' });
       }
       return res.status(500).json({ error: message });
    }

    if (message.includes('Cloudflare')) {
       return res.status(500).json({ error: message });
    }

    if (message.includes('Modal')) {
       return res.status(500).json({ error: message });
    }

    // Default to Hugging Face error handling
    if (message.includes('402') || message.includes('credit')) {
      return res.status(402).json({ error: 'Hết credit Hugging Face. Vui lòng nạp thêm hoặc nâng cấp tài khoản HF.' });
    }
    if (message.includes('401') || message.includes('Unauthorized')) {
      return res.status(401).json({ error: 'Token HF không hợp lệ hoặc đã hết hạn.' });
    }
    
    return res.status(500).json({ error: 'Server error: ' + message });
  }
}
