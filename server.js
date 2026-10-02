const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    app: "VendeIA API"
  });
});

app.post("/ia", async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Mensagem não informada."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions:
        "Você é a IA vendedora do aplicativo VendeIA. " +
        "Responda de forma simpática, profissional e persuasiva, " +
        "sem inventar informações sobre produtos, preços ou estoque.",
      input: mensagem
    });

    res.json({
      resposta: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Não foi possível gerar a resposta da IA."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VendeIA API rodando na porta ${PORT}`);
});
