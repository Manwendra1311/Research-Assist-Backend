import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from 'openai';

const port = 3001;

const openai = new OpenAI({
    apiKey: "" 
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
    const { prompt, domain } = req.body;

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `${domain} domain: ${prompt}` }],
            stream: true,
        });

        let responseData = "";

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            responseData += content;
        }

        res.json({ response: responseData });
    } catch (error) {
        console.error("Error during API request:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});
