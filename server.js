import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint for AI image generation
app.post('/generate', async (req, res) => {
  const { prompt, model } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt missing!" });

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${process.env.HF_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ inputs: prompt })
    });
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// Serve frontend
app.use(express.static('frontend'));

// Railway dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
