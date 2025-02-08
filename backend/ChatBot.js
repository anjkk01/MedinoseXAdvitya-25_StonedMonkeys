const { ChatOpenAI } = require("@langchain/openai");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

// Initialize GPT-4o-mini
const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7, // Adjusts randomness
});

const DB_SCHEMA = `
Schema:
doctor_table(doctor_id, username, password, name, rating, charge_per_hour)
patient_table(patient_id, username, password)
doctor_appointment(appointment_id, doctor_id, patient_id, appointment_date, time_from, time_to)
languages_table(language_id, doctor_id, language_name)
speciality_table(speciality_id, doctor_id, speciality_name)
`;

// Function to interact with GPT-4o-mini
async function askChatGPT(userInput) {
  const messages = [
    {
      role: "system",
      content: `You have access to the following database schema:\n${DB_SCHEMA}
      Users will ask about symptoms, doctor availability, and general medical queries.
      - If the question requires fetching from the database, return ONLY a SQL query.
      - Otherwise, provide a general response.`,
    },
    { role: "user", content: userInput },
  ];

  const response = await llm.invoke(messages);
  return response.content.trim(); // Extracts the text response
}

// Function to process user query
async function processUserQuery(userId, userInput) {
  const chatGPTResponse = await askChatGPT(userInput);

  if (typeof chatGPTResponse === "string" && chatGPTResponse.toLowerCase().startsWith("select")) {
    try {
      const dbResponse = await prisma.$queryRawUnsafe(chatGPTResponse);
      await prisma.chat_history.create({
        data: { user_id: userId, message: userInput, response: JSON.stringify(dbResponse) },
      });
      return dbResponse;
    } catch (error) {
      console.error("Database Error:", error);
      return "There was an error processing your request.";
    }
  } else {
    await prisma.chat_history.create({
      data: { user_id: userId, message: userInput, response: chatGPTResponse },
    });
    return chatGPTResponse;
  }
}

// Main chatbot function
const ChatBot = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: "Missing parameters" });

    const response = await processUserQuery(userId, message);
    res.json({ response });
  } catch (error) {
    console.error("ChatBot Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { ChatBot };
