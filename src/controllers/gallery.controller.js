import { responseQueries } from "../common/enum/queries/response.queries.js"
import { variablesDB } from "../utils/params/const.database.js"
import getConnection from "../database/connection.mysql.js"
import { sendEmail } from "./email.controller.js";
import sharp from "sharp";

// Traer todas las imágenes de la galería
export const getAllGallery = async (req, res) => {
    const conn = await getConnection();
    const db = variablesDB.data_base;
    const query = `
    SELECT * FROM ${db}.artworks WHERE status = 1;`;
    const select = await conn.query(query);
    if (!select) return res.json({
        status: 500,
        message: 'Error obteniendo los datos'
    });
    return res.json(responseQueries.success({ data: select[0] }));
}

// Guardar imagen en la galería
export const saveImageGallery = async (req, res) => {
    //Iniciar transacción
    const conn = await getConnection();
    await conn.beginTransaction();
    try {
        const { name_user, title, description, username } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ message: "Falta la imagen" });
        }

        const optimized = await sharp(imageFile.buffer)
            .resize({ width: 1200 })
            .webp({ quality: 80 })
            .toBuffer();
        const imageBase64 = `data:image/webp;base64,${optimized.toString("base64")}`;

        // Convertir a Base64 en el backend
        // const imageBase64 = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

        const conn = await getConnection();
        const db = variablesDB.data_base;

        const query = `
        INSERT INTO ${db}.artworks (name_user, title, description, username, image_base64, created_at, status)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), 0);
        `;

        const insert = await conn.query(query, [
            name_user,
            title,
            description,
            username,
            imageBase64,
        ]);

        if (!insert) {
            return res.status(500).json(responseQueries.error({ message: "Error guardando la imagen" }));
        }

        const responseMail = await sendEmail(name_user, title, username);


        // Confirmar la transacción
        await conn.commit();

        return res.json(responseQueries.success({
            status: 200,
            message: "Imagen guardada correctamente",
            data: responseMail
        }));
    } catch (error) {
        // Revertir la transacción en caso de error
        await conn.rollback();
        return res.status(500).json(responseQueries.error({ message: "Error interno del servidor" }));
    }
};