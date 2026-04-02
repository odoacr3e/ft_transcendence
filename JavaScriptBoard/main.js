import { initBoard } 		from "./Data/data.js";
import { initGamerenderer } from "./Renderer/render.js";
import { globalEvents } 	from "./Events/global.js";

const Board = initBoard();
initGamerenderer(Board);
globalEvents();

export { Board };