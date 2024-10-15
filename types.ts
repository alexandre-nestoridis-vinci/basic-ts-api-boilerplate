interface Pizza {
  id: number;
  title: string;
  content: string;
}

interface PizzaToUpdate {
  title?: string;
  content?: string;
}

interface Film {
  id: number;
  title: string;
  director: string;
  duration: number;
  budget?: number;
  description?: string;
  imageUrl?: string;
}

interface FilmToUpdate {
  title?: string;
  director?: string;
  duration?: number;
  budget?: number;
  description?: string;
  imageUrl?: string;
}





type NewPizza = Omit<Pizza, "id">;

type NewFilm = Omit<Film, "id">;



export type { Pizza, NewPizza, PizzaToUpdate, Film, FilmToUpdate , NewFilm};
