import express from 'express';
import cors from 'cors';
import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Setup clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Sample product data
const products = [
  // { id: 1, name: "Wireless Mouse", desc: "A sleek Bluetooth wireless mouse", price: 29.99 },
  // { id: 2, name: "Noise Cancelling Headphones", desc: "Great for focus and travel", price: 199.99 },
  // { id: 3, name: "Mechanical Keyboard", desc: "Responsive keys for gaming and typing", price: 89.99 },
  { id: 4, name: "4K Monitor", desc: "Crisp display for professional work", price: 399.99 },
  { id: 5, name: "Gaming Mousepad", desc: "Large surface for smooth mouse movement", price: 24.99 },
  { id: 6, name: "USB-C Hub", desc: "Expand your laptop connectivity", price: 49.99 },
  { id: 7, name: "Wireless Charger", desc: "Fast charging for compatible devices", price: 34.99 },
  { id: 8, name: "Laptop Stand", desc: "Ergonomic stand for better posture", price: 39.99 },
  { id: 9, name: "External SSD", desc: "High-speed portable storage", price: 129.99 },
  { id: 10, name: "Webcam", desc: "1080p HD streaming camera", price: 79.99 },
  { id: 11, name: "Blue Light Glasses", desc: "Reduce eye strain during screen time", price: 19.99 },
  { id: 12, name: "Ergonomic Chair", desc: "Comfortable seating for long hours", price: 299.99 },
  { id: 13, name: "Smart Desk Lamp", desc: "Adjustable brightness and color temperature", price: 59.99 },
  { id: 14, name: "Noise Cancelling Earbuds", desc: "Compact wireless earbuds with ANC", price: 149.99 },
  { id: 15, name: "Wireless Presentation Remote", desc: "Control presentations from anywhere", price: 29.99 },
  { id: 16, name: "Document Scanner", desc: "Portable scanner for documents", price: 129.99 },
  { id: 17, name: "Vertical Mouse", desc: "Ergonomic design reduces wrist strain", price: 49.99 },
  { id: 18, name: "RGB Gaming Mouse", desc: "Customizable lighting and programmable buttons", price: 69.99 },
  { id: 19, name: "Laptop Cooling Pad", desc: "Prevents overheating during intensive tasks", price: 34.99 },
  { id: 20, name: "Desktop Microphone", desc: "Crystal clear voice for calls and recordings", price: 89.99 },
];

// Helper function to get embeddings
async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

// API Routes
app.post('/api/index-products', async (req, res) => {
  try {
    // First, try to create the collection
    try {
      await qdrant.createCollection("products", {
        vectors: {
          size: 1536, // text-embedding-3-small dimension
          distance: "Cosine",
        },
      });
      console.log('Collection created successfully');
    } catch (collectionError) {
      // Collection might already exist, which is fine
      console.log('Collection might already exist:', collectionError.message);
    }

    // Index products
    for (const product of products) {
      const embedding = await getEmbedding(product.desc);
      await qdrant.upsert("products", {
        points: [
          {
            id: product.id,
            vector: embedding,
            payload: { name: product.name, desc: product.desc },
          },
        ],
      });
    }
    res.json({ success: true, message: 'Products indexed successfully' });
  } catch (error) {
    console.error('Error indexing products:', error);
    res.status(500).json({ error: 'Failed to index products' });
  }
});

app.post('/api/search-products', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const queryEmbedding = await getEmbedding(query);
    const searchResult = await qdrant.search("products", {
      vector: queryEmbedding,
      limit: 20,
    });

    const results = searchResult.map(item => item.payload);
    res.json({ results });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});