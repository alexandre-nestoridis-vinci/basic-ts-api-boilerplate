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

interface Text {
  id: number;
  content: string;
  level: 'easy' | 'medium' | 'hard';
}

interface TextToUpdate {
  content?: string;
  level?: 'easy' | 'medium' | 'hard';
}



type NewPizza = Omit<Pizza, "id">;

type NewFilm = Omit<Film, "id">;

type NewText = Omit<Text, "id">;

export type { Pizza, NewPizza, PizzaToUpdate, Film, NewFilm, Text, NewText, TextToUpdate  };
