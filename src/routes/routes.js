import express from "express";

// Middlewares
import { AuthorizationVerify } from "../middleware/authorization.js"
import { ConnectionVerify } from "../middleware/connection.js"
import { upload } from "../middleware/multer.js";

// Controllers
import { getAllGallery, saveImageGallery } from "../controllers/gallery.controller.js"

// Database
import { getConnect } from "../database/connection.controller.js"

const router = express();

export const routes = () => {
    // Routes Gallery
    router.get("/gallery/g/images", AuthorizationVerify, getAllGallery)
    router.post("/gallery/p/image", upload.single("image"), AuthorizationVerify, saveImageGallery)

    // Database
    router.get("/connect/", ConnectionVerify, getConnect)

    return router;
}