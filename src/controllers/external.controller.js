import axios from "axios";

//Obtener imagen de instagram con proxy
export const getImageWithProxy = async (req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.query.url);

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    // Obtener tipo de contenido (ej: image/jpeg)
    const contentType = response.headers["content-type"];

    res.set("Content-Type", contentType);
    res.send(response.data);
  } catch (error) {
    console.error("Error al obtener imagen:", error.message);
    res.status(500).send("Error al obtener imagen");
  }
}