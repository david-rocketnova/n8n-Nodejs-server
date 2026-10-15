const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const N8N_URL = process.env.N8N_URL || "https://n8n.telecommutingpeople.com/webhook/n8n-nodejs-DavidBravo";

app.post("/enviar", async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "El campo 'texto' es obligatorio" });
  }

  try {
    const respuesta = await fetch(N8N_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });

    if (!respuesta.ok) {
      throw new Error(`Error en n8n: ${respuesta.statusText}`);
    }

    const resultado = await respuesta.text();
    
    let datosFinales;
    try {
      datosFinales = JSON.parse(resultado);
    } catch {
      datosFinales = resultado;
    }

    res.json({ respuesta: datosFinales });
  } catch (error) {
    console.error("Error al contactar con n8n:", error.message);
    res.status(500).json({ error: "No se pudo contactar con n8n" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});