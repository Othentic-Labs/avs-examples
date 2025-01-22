import express from "express";
import dotenv from "dotenv";
import getSouthernBelleAnswer from "./utils/openai.js"; // Add the .js extension for local imports in ES Modules

// const { ReclaimProofRequest } = require('@reclaimprotocol/js-sdk')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Configure text parser for proof object handling
app.use(express.text({ type: '*/*', limit: '50mb' })); 

// Example route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/ask", async (req, res) => {
    const { question } = req.body;
  
    if (!question) {
      return res.status(400).json({ error: "Question is required!" });
    }
  
    try {
      const answer = await getSouthernBelleAnswer(question);
      res.status(200).json({ answer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Route to generate SDK configuration
app.get('/reclaim/generate-config', async (req, res) => {
  // Replace with your actual credentials
  const APP_ID = process.env.RECLAIM_APP_ID
  const APP_SECRET = process.env.RECLAIM_APP_SECRET
  const PROVIDER_ID = process.env.RECLAIM_PROVIDER_ID
 
  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)
    
    // Set the callback URL where proofs will be received
    reclaimProofRequest.setAppCallbackUrl('http://localhost:3000/receive-proofs')
    
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()
 
    return res.json({ reclaimProofRequestConfig })
  } catch (error) {
    console.error('Error generating request config:', error)
    return res.status(500).json({ error: 'Failed to generate request config' })
  }
})
 
// Route to handle incoming proofs
app.post('/receive-proofs', (req, res) => {
  const proofs = req.body
  console.log('Received proofs:', proofs)
  // Implement your proof processing logic here
  return res.sendStatus(200)
})
 
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
