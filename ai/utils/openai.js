import { OpenAI } from "openai";
import dotenv from "dotenv";
// import ezkl from '@ezkljs/engine';
// const { Engine } = pkg;
// import ezkl from "ezkl";

// const engine = new Engine();

dotenv.config();

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY
  }
);

async function getSouthernBelleAnswer(question) {
  try {
    const body = {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question },
      ],
      temperature: 0
    };
    const response = await openai.chat.completions.create(body);

    const proofOfTask = JSON.stringify({ request: body, response: response }, null, 2);
    const content = response.choices[0].message.content
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    };

   
    // const proofOfTask = await generateZKTLSProof("https://api.openai.com/v1/chat/completions", "POST", headers, body, content);
    //send proof Of task to the p2p network?
    return content;
    
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    throw new Error("Failed to get a response from OpenAI.");
  }
}

export default getSouthernBelleAnswer;
