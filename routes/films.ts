import { Router } from "express";

import path from "node:path";
import { NewFilm, Film } from "../types";
import { parse, serialize } from "../utils/json";


const router = Router();

const jsonDbPath = path.join(__dirname, "/../data/films.json");

let getRequestCounter = 0;


const defaultFilms: Film[] = [
    {
      id: 1,
      title: "Inception",
      director: "Christopher Nolan",
      duration: 148,
      budget: 160,
      description: "A mind-bending thriller about dream invasion.",
      imageUrl: "https://example.com/inception.jpg"
    },
    {
      id: 2,
      title: "The Matrix",
      director: "Lana Wachowski, Lilly Wachowski",
      duration: 136,
      budget: 63,
      description: "A hacker discovers the reality is a simulation.",
      imageUrl: "https://example.com/matrix.jpg"
    },
    {
      id: 3,
      title: "Interstellar",
      director: "Christopher Nolan",
      duration: 169,
      budget: 165,
      description: "A journey through space and time to save humanity.",
      imageUrl: "https://example.com/interstellar.jpg"
    },
    {
      id: 4,
      title: "The Godfather",
      director: "Francis Ford Coppola",
      duration: 175,
      budget: 6,
      description: "The story of a powerful Italian-American crime family.",
      imageUrl: "https://example.com/godfather.jpg"
    },
    {
      id: 5,
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      duration: 154,
      budget: 8,
      description: "A series of interconnected stories in Los Angeles.",
      imageUrl: "https://example.com/pulpfiction.jpg"
    }
  ];

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
    const orderByDuration =
        typeof req.query.order === "string" && req.query.order.includes("duration")
        ? req.query.order
        : undefined;
    
    let filmsMenu: Film[] = []
    const films = parse(jsonDbPath, defaultFilms);

    if (orderByDuration)
        filmsMenu = [...films].sort((a, b) => a.duration - b.duration);

    return res.json(filmsMenu.length === 0 ? films : filmsMenu);
  });

  /*
  GET films/{id} : Read the film identified by an id in the menu
  */

  router.get("/:id", (req, res) => {
    const films = parse(jsonDbPath, defaultFilms);
    const idInRequest = parseInt(req.params.id, 10);
    const indexOfFilmFound = films.findIndex(
      (film: Film) => film.id === idInRequest
    );
  
    if (indexOfFilmFound < 0) return res.sendStatus(404);
  
    return res.json(films[indexOfFilmFound]);
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
  const films = parse(jsonDbPath, defaultFilms);
  const nextId = 
    films.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 
    1;

  const addedFilm: Film = {
    id: nextId,
    title,
    director,
    duration,
    budget,
    description,
    imageUrl
  };

  films.push(addedFilm);

  serialize(jsonDbPath, films);

  return res.json(addedFilm);
});


// Delete a film from the menu
router.delete("/:id", (req, res) => {

  const films = parse(jsonDbPath, defaultFilms);
  console.log("delete operation requested on ", films);
  const idInRequest = parseInt(req.params.id, 10);
  const foundIndex = films.findIndex((film) => film.id === idInRequest);

  if (foundIndex < 0) return res.sendStatus(404);

  const itemsRemovedFromMenu = films.splice(foundIndex, 1);
  const itemRemoved = itemsRemovedFromMenu[0];

  serialize(jsonDbPath, films);

  return res.json(itemRemoved);
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
    ("duration" in body &&
      (typeof body.duration !== "number" || !body.duration)) ||
    ("budget" in body &&
      (typeof body.budget !== "number" || !body.budget)) ||
    ("description" in body &&
      (typeof body.description !== "string" || !body.description.trim())) ||
    ("imageUrl" in body &&
      (typeof body.imageUrl !== "string" || !body.imageUrl.trim()))
  ) {
    return res.sendStatus(400);
  }

  const filmToUpdate: NewFilm = body as NewFilm;

  const films = parse(jsonDbPath, defaultFilms);
  const idInRequest = parseInt(req.params.id, 10);
  const foundIndex = films.findIndex((film) => film.id === idInRequest);

  if (foundIndex < 0) return res.sendStatus(404);

  const updatedFilm: Film = { ...films[foundIndex], ...filmToUpdate };

  films[foundIndex] = updatedFilm;

  serialize(jsonDbPath, films);

  return res.json(updatedFilm);
});


// Put a film based on its id and new values for its parameters
router.put("/:id", (req, res) => {
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

  const filmToUpdate: NewFilm = body as NewFilm;

  const films = parse(jsonDbPath, defaultFilms);
  const idInRequest = parseInt(req.params.id, 10);
  const foundIndex = films.findIndex((film) => film.id === idInRequest);

  if (foundIndex < 0) return res.sendStatus(404);

  const updatedFilm: Film = { ...films[foundIndex], ...filmToUpdate };

  films[foundIndex] = updatedFilm;

  serialize(jsonDbPath, films);

  return res.json(updatedFilm);
});


export default router;