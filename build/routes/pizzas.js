"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_path_1 = __importDefault(require("node:path"));
const json_1 = require("../utils/json");
const router = (0, express_1.Router)();
const jsonDbPath = node_path_1.default.join(__dirname, "/../data/pizzas.json");
const defaultPizzas = [
    {
        id: 1,
        title: "4 fromages",
        content: "Gruyère, Sérac, Appenzel, Gorgonzola, Tomates",
    },
    {
        id: 2,
        title: "Vegan",
        content: "Tomates, Courgettes, Oignons, Aubergines, Poivrons",
    },
    {
        id: 3,
        title: "Vegetarian",
        content: "Mozarella, Tomates, Oignons, Poivrons, Champignons, Olives",
    },
    {
        id: 4,
        title: "Alpage",
        content: "Gruyère, Mozarella, Lardons, Tomates",
    },
    {
        id: 5,
        title: "Diable",
        content: "Tomates, Mozarella, Chorizo piquant, Jalapenos",
    },
];
/* Read all the pizzas from the menu
   GET /pizzas?order=title : ascending order by title
   GET /pizzas?order=-title : descending order by title
*/
router.get("/", (req, res) => {
    if (req.query.order && typeof req.query.order !== "string") {
        return res.sendStatus(400);
    }
    const orderByTitle = typeof req.query.order === "string" && req.query.order.includes("title")
        ? req.query.order
        : undefined;
    let orderedMenu = [];
    const pizzas = (0, json_1.parse)(jsonDbPath, defaultPizzas);
    if (orderByTitle)
        orderedMenu = [...pizzas].sort((a, b) => a.title.localeCompare(b.title));
    if (orderByTitle === "-title")
        orderedMenu = orderedMenu.reverse();
    return res.json(orderedMenu.length === 0 ? pizzas : orderedMenu);
});
// Read the pizza identified by an id in the menu
router.get("/:id", (req, res) => {
    const pizzas = (0, json_1.parse)(jsonDbPath, defaultPizzas);
    const idInRequest = parseInt(req.params.id, 10);
    const indexOfPizzaFound = pizzas.findIndex((pizza) => pizza.id === idInRequest);
    if (indexOfPizzaFound < 0)
        return res.sendStatus(404);
    return res.json(pizzas[indexOfPizzaFound]);
});
// Create a pizza to be added to the menu.
router.post("/", (req, res) => {
    const body = req.body;
    if (!body ||
        typeof body !== "object" ||
        !("title" in body) ||
        !("content" in body) ||
        typeof body.title !== "string" ||
        typeof body.content !== "string" ||
        !body.title.trim() ||
        !body.content.trim()) {
        return res.sendStatus(400);
    }
    const { title, content } = body;
    const pizzas = (0, json_1.parse)(jsonDbPath, defaultPizzas);
    // Use reduce() to find the highest id in the pizzas array
    const nextId = pizzas.reduce((maxId, pizza) => (pizza.id > maxId ? pizza.id : maxId), 0) +
        1; // 0 is the initial value of maxId
    const addedPizza = {
        id: nextId,
        title,
        content,
    };
    pizzas.push(addedPizza);
    (0, json_1.serialize)(jsonDbPath, pizzas);
    return res.json(addedPizza);
});
// Delete a pizza from the menu based on its id
router.delete("/:id", (req, res) => {
    const pizzas = (0, json_1.parse)(jsonDbPath, defaultPizzas);
    console.log("delete operation requested on ", pizzas);
    const idInRequest = parseInt(req.params.id, 10);
    const foundIndex = pizzas.findIndex((pizza) => pizza.id === idInRequest);
    if (foundIndex < 0)
        return res.sendStatus(404);
    const itemsRemovedFromMenu = pizzas.splice(foundIndex, 1);
    const itemRemoved = itemsRemovedFromMenu[0];
    (0, json_1.serialize)(jsonDbPath, pizzas);
    return res.json(itemRemoved);
});
// Update a pizza based on its id and new values for its parameters
router.patch("/:id", (req, res) => {
    const body = req.body;
    if (!body ||
        typeof body !== "object" ||
        ("title" in body &&
            (typeof body.title !== "string" || !body.title.trim())) ||
        ("content" in body &&
            (typeof body.content !== "string" || !body.content.trim()))) {
        return res.sendStatus(400);
    }
    const pizzaToUpdate = body;
    const pizzas = (0, json_1.parse)(jsonDbPath, defaultPizzas);
    const idInRequest = parseInt(req.params.id, 10);
    const foundIndex = pizzas.findIndex((pizza) => pizza.id === idInRequest);
    if (foundIndex < 0)
        return res.sendStatus(404);
    const updatedPizza = Object.assign(Object.assign({}, pizzas[foundIndex]), pizzaToUpdate);
    pizzas[foundIndex] = updatedPizza;
    (0, json_1.serialize)(jsonDbPath, pizzas);
    return res.json(updatedPizza);
});
exports.default = router;
