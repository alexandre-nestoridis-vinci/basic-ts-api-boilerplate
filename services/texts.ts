import path from "node:path";
import { Text, NewText } from "../types";
import { parse, serialize } from "../utils/json";
const jsonDbPath = path.join(__dirname, "/../data/films.json");


const defaultTexts: Text[] = [
  {
    id: 1,
    content: "About us",
    level: "medium",
  },
  {
    id: 2,
    content: "Contact",
    level: "easy",
  },
  {
    id: 3,
    content: "Home",
    level: "hard",
  },
  {
    id: 4,
    content: "Services",
    level: "medium",
  },
  {
    id: 5,
    content: "Pricing",
    level: "easy",
  },
];

function readAllTexts(order: string | undefined): Text[] {
  const orderByTitle = order && order.includes("content") ? order : undefined;

  let orderedMenu: Text[] = [];
  const texts = parse(jsonDbPath, defaultTexts);
  if (orderByTitle) {
    orderedMenu = texts.sort((a, b) =>
      a.content.localeCompare(b.content)
    );
  } else {
    orderedMenu = texts;
  }
  return orderedMenu;
}

function readTextByLevel(level: string): Text[] {
  const texts = parse(jsonDbPath, defaultTexts);
  return texts.filter((text) => text.level === level);
}

function readTextById(id: number): Text | undefined {
  const texts = parse(jsonDbPath, defaultTexts);
  return texts.find((text) => text.id === id);
}

function createText(newText: NewText): Text {
  const texts = parse(jsonDbPath, defaultTexts);
  const lastId = texts[texts.length - 1].id;
  const text: Text = { id: lastId + 1, ...newText };
  const updatedTexts = [...texts, text];
  serialize(jsonDbPath, updatedTexts);
  return text;
}

function deleteText(id: number): Text | undefined {
  const texts = parse(jsonDbPath, defaultTexts);
  const index = texts.findIndex((text) => text.id === id);
  if (index === -1) return undefined;

  const deletedElements = texts.splice(index, 1);
  serialize(jsonDbPath, texts);
  return deletedElements[0];
}

function updateText(
  id: number,
  updatedText: Partial<NewText>
): Text | undefined {
  const texts = parse(jsonDbPath, defaultTexts);
  const text = texts.find((text) => text.id === id);
  if (!text) return undefined;

  if (updatedText.content !== undefined) {
    text.content = updatedText.content;
  }
  if (updatedText.level !== undefined) {
    text.level = updatedText.level;
  }

  serialize(jsonDbPath, texts);
  return text;
}

export {readAllTexts, readTextByLevel, readTextById, createText, deleteText, updateText};