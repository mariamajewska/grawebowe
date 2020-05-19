import './main.scss';
import { Game } from './Game';

const app = new Game(<HTMLCanvasElement>document.getElementById("myCanvas"), 10, 10, 10, 50);