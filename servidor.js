const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("publico"));

const N8N_URL = "https://n8n.telecommutingpeople.com/webhook/hola-n8n-AntonioLobato";

app.post("/enviar", async (req, res) => {
  const { texto } = req.body;

  try {
    const respuesta = await fetch(N8N_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    const resultado = await respuesta.text();
    res.json({ respuesta: resultado });
  } catch (error) {
    res.status(500).json({ error: "No se pudo contactar con n8n" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
