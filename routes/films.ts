import { Router } from "express";

import path from "node:path";
import {Film} from "../types";
import { parse } from "../utils/json";


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

  router.get("/", (req, res) => {
    if (req.query.order && typeof req.query.order !== "string") {
        return res.sendStatus(400);
      }
    let filmsMenu: Film[] = []
    const films = parse(jsonDbPath, defaultFilms);
    return res.json(filmsMenu.length === 0 ? films : filmsMenu);
  });


export default router;