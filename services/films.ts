import path from "node:path";
import { NewFilm, Film } from "../types";
import { parse, serialize } from "../utils/json";
const jsonDbPath = path.join(__dirname, "/../data/films.json");


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


  function readAllFilms(order: string | undefined): Film[] {
    const orderByTitle = order && order.includes("title") ? order : undefined;
  
    let orderedMenu: Film[] = [];
    const films = parse(jsonDbPath, defaultFilms);
    if (orderByTitle)
      orderedMenu = [...films].sort((a, b) => a.title.localeCompare(b.title));
  
    if (orderByTitle === "-title") orderedMenu = orderedMenu.reverse();
  
    return orderedMenu.length === 0 ? films : orderedMenu;
  }


  function readFilmById(id: number): Film | undefined {
    const films = parse(jsonDbPath, defaultFilms);
    return films.find((film) => film.id === id);
  }


  function createFilm(newFilm: NewFilm): Film {
    const films = parse(jsonDbPath, defaultFilms);
    const lastId = films[films.length - 1].id;
    const film: Film = { id: lastId + 1, ...newFilm };
    const updatedFilms = [...films, film];
    serialize(jsonDbPath, updatedFilms);
    return film;
  }


  function deleteFilm(id: number): Film | undefined {
    const films = parse(jsonDbPath, defaultFilms);
    const index = films.findIndex((film) => film.id === id);
    if (index === -1) return undefined;
  
    const deletedElements = films.splice(index, 1);
    serialize(jsonDbPath, films);
    return deletedElements[0];
  }


  function updateFilm(
    id: number,
    updatedFilm: Partial<NewFilm>
  ): Film | undefined {
    const films = parse(jsonDbPath, defaultFilms);
    const film = films.find((film) => film.id === id);
    if (!film) return undefined;
  
    if (updatedFilm.title !== undefined) {
      film.title = updatedFilm.title;
    }
    if (updatedFilm.director !== undefined) {
      film.director = updatedFilm.director;
    }
    if (updatedFilm.duration !== undefined) {
      film.duration = updatedFilm.duration;
    }
    if (updatedFilm.budget !== undefined) {
      film.budget = updatedFilm.budget;
    }
    if (updatedFilm.description !== undefined) {
      film.description = updatedFilm.description;
    }
    if (updatedFilm.imageUrl !== undefined) {
      film.imageUrl = updatedFilm.imageUrl;
    }
  
    serialize(jsonDbPath, films);
    return film;
  }
  
  export { readAllFilms, readFilmById, createFilm, deleteFilm, updateFilm };