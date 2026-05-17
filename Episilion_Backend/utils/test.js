require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY, // nvapi-... key
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function run() {
  const completion = await client.chat.completions.create({
    model: "minimaxai/minimax-m2.7",
    messages: [{ role: "user", content: "Suggest a cheap hostel for a student in Accra" }],
    temperature: 1,
    top_p: 0.95,
    max_tokens: 8192,
    stream: true,
  });

  for await (const chunk of completion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

run();



