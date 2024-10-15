import { Router } from "express";

import { NewText, TextToUpdate } from "../types";

const router = Router();

import {
    readAllTexts,
    readTextByLevel,
    readTextById,
    createText,
    deleteText,
    updateText,
} from "../services/texts";

// texts	GET	READ ALL : Lire toutes les ressources de la collection
router.get("/", (req, res) => {
    if (req.query.level && typeof req.query.level !== "string") {
        return res.sendStatus(400);
    }
    const texts = readAllTexts(req.query.level);

    return res.json(texts);
});

// texts?level=value	GET	READ ALL FILTERED : Lire toutes les ressources de la collection selon le filtre donné
router.get("/level", (req, res) => {
    const level = req.query.level;
    if (level !== "easy" && level !== "medium" && level !== "hard") {
        return res.sendStatus(400);
    }
    const texts = readTextByLevel(level);
    return res.json(texts);
});

// texts/:id	GET	READ ONE : Lire la ressource identifiée
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const text = readTextById(id);
    if (!text) return res.sendStatus(404);
    return res.json(text);
});

// texts	POST	CREATE ONE : Créer une ressource basée sur les données de la requête
router.post("/", (req, res) => {
    const body: unknown = req.body;
    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        return res.sendStatus(400);
    }
    const newText = body as NewText;
    const text = createText(newText);
    return res.status(201).json(text);
});

// texts/:id	DELETE	DELETE ONE : Effacer la ressource identifiée
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const text = deleteText(id);
    if (!text) return res.sendStatus(404);
    return res.json(text);
});

// texts/:id	PUT	UPDATE ONE : Remplacer l'entièreté de la ressource par les données de la requête
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const body: unknown = req.body;
    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        return res.sendStatus(400);
    }
    const newText = body as TextToUpdate;
    const text = updateText(id, newText);
    if (!text) return res.sendStatus(404);
    return res.json(text);
});


export default router;