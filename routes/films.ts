import { Router } from "express";

import { NewFilm, FilmToUpdate } from "../types";
// import { parse, serialize } from "../utils/json";


const router = Router();

let getRequestCounter = 0;

import {
  readAllFilms,
  readFilmById,
  createFilm,
  deleteFilm,
  updateFilm,
} from "../services/films";


  router.use((req, _res, next) => {
    if (req.method === "GET") {
        getRequestCounter++;
        console.log(`GET requests counter: ${getRequestCounter}`);
    }
    next();
  });


  /*
   GET /films?minimum-duration=value : ascending order by duration
  */

  router.get("/", (req, res) => {
    if (req.query.order && typeof req.query.order !== "string") {
        return res.sendStatus(400);
      }
    const films = readAllFilms(req.query.order);

    return res.json(films);
  });

  /*
  GET films/{id} : Read the film identified by an id in the menu
  */

  router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const film = readFilmById(id);
    if (!film) return res.sendStatus(404);
    return res.json(film);
  });

  /* 
  POST films : Create a film to be added to the menu.
  */
router.post("/", (req, res) => {
  const body: unknown = req.body;
  if (
    !body ||
    typeof body !== "object" ||
    !("title" in body) ||
    !("director" in body) ||
    !("duration" in body) ||
    !("budget" in body) ||
    !("description" in body) ||
    !("imageUrl" in body) ||
    typeof body.title !== "string" ||
    typeof body.director !== "string" ||
    typeof body.duration !== "number" ||
    typeof body.budget !== "number" ||
    typeof body.description !== "string" ||
    typeof body.imageUrl !== "string" ||
    !body.title.trim() ||
    !body.director.trim() ||
    !body.description.trim() ||
    !body.imageUrl.trim()
  ) {
    return res.sendStatus(400);
  }

  const { title, director, duration, budget, description, imageUrl } = body as NewFilm;

  const addedFilm = createFilm({ title, director, duration, budget, description, imageUrl });

  return res.json(addedFilm);
});


// Delete a film from the menu
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedFilm = deleteFilm(id);
  if (!deletedFilm) return res.sendStatus(404);

  return res.json(deletedFilm);
});

// Update a film based on its id and new values for its parameters
router.patch("/:id", (req, res) => {
  const body: unknown = req.body;
  if (
    !body ||
    typeof body !== "object" ||
    ("title" in body &&
      (typeof body.title !== "string" || !body.title.trim())) ||
    ("director" in body &&
      (typeof body.director !== "string" || !body.director.trim())) ||
    ("duration" in body && typeof body.duration !== "number") ||
    ("budget" in body && typeof body.budget !== "number") ||
    ("description" in body &&
      (typeof body.description !== "string" || !body.description.trim())) ||
    ("imageUrl" in body &&
      (typeof body.imageUrl !== "string" || !body.imageUrl.trim()))
  ) {
    return res.sendStatus(400);
  }

  const filmToUpdate: FilmToUpdate = body;

  const id = Number(req.params.id);
  const updatedFilm = updateFilm(id, filmToUpdate);
  if (!updatedFilm) return res.sendStatus(404);

  return res.json(updatedFilm);
});



export default router;