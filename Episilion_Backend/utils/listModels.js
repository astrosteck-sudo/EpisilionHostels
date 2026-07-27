require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function main() {
  try {
    const models = await client.models.list();

    models.data.forEach(model => {
      console.log(model.id);
    });
  } catch (err) {
    console.error(err);
  }
}

main();