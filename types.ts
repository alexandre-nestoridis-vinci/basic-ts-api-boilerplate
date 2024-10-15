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

<<<<<<< HEAD
interface Text {
  id: number;
  content: string;
  level: 'easy' | 'medium' | 'hard';
}

interface TextToUpdate {
  content?: string;
  level?: 'easy' | 'medium' | 'hard';
}
=======
interface FilmToUpdate {
  title?: string;
  director?: string;
  duration?: number;
  budget?: number;
  description?: string;
  imageUrl?: string;
}


>>>>>>> d5f04a925844450324074cd4f84c25fdd41742d2



type NewPizza = Omit<Pizza, "id">;

type NewFilm = Omit<Film, "id">;

<<<<<<< HEAD
type NewText = Omit<Text, "id">;

export type { Pizza, NewPizza, PizzaToUpdate, Film, NewFilm, Text, NewText, TextToUpdate  };
=======


export type { Pizza, NewPizza, PizzaToUpdate, Film, FilmToUpdate , NewFilm};
>>>>>>> d5f04a925844450324074cd4f84c25fdd41742d2
