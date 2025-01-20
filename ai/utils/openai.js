const { OpenAI, Configuration } = require("openai/index.mjs");

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
  }
);

async function getSouthernBelleAnswer(question) {
  try {

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question },
      ],
    });

    return response.choices[0].message.content;
    
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    throw new Error("Failed to get a response from OpenAI.");
  }
}

module.exports = getSouthernBelleAnswer;
