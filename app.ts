import express from "express";

import usersRouter from "./routes/users";
import pizzaRouter from "./routes/pizzas";
import filmsRouter from "./routes/films";
import textsRouter from "./routes/texts";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/pizzas", pizzaRouter);
app.use("/films", filmsRouter);
app.use("/texts", textsRouter);



export default app;
