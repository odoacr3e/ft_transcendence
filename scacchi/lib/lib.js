
import http from "http";
import https from "https";
import url from "url";
import fs from "fs";
import { openSync } from 'fs';
import path from "path";
import express from "express";
import {Server as SocketIO} from "socket.io";
import jwt from "jsonwebtoken";
import cors from 'cors';
import { parse } from "cookie";
import cookieParser from 'cookie-parser';

// SECTION: vars
const app = express();
const server = http.createServer(app);
export const logfd = openSync("../log", 'a+');
export const PORT = process.env.PORT || 8080;
export const ALLOWED_URL = process.env.ALLOWED_URL?.split(',') ?? ['http://localhost:5173'];

// SECTION: connections
import { prisma } from "./prisma.js";
import { redis } from "./redis.js";
import crypto from "crypto";
import { sendEmail, bodyOTP, bodyRegistration } from "./emailSender.js"

redis.on("error", (stream) =>
{
	if (process.env.IGNORE_REDIS == "true")
		return ;
	console.error(stream);
});

// SECTION - external inclusions
const include = {http, https, url, fs, path, express, SocketIO, app, server, parse, cookieParser};

// SECTION - chess classes/objects
import {Piece} from "../Classes/Chess/Pieces/pieces.js";
import {Preset, preset} from "../Classes/Chess/Pieces/preset.js";
import {Cursor} from "../Classes/Chess/cursor.js";
import {includesOneOf} from "../utils/string.js";
import {ChessBoard, Square, initBoard, copyBoard, copyBoostedTargetZones} from "../Classes/Chess/chessBoard.js";
const Chess = {Piece, Preset, preset, ChessBoard, initBoard, copyBoard, copyBoostedTargetZones, Cursor, Square};

// SECTION - macro
import * as Macro from "../Macro/macro.js";

// SECTION - Enums
import * as Enums from "../Macro/enums.js";

// SECTION - utils function
import * as utils from "../utils/dangerUpdate.js";
let gameUtils = {};

const conn = { redis, crypto, sendEmail, bodyOTP, bodyRegistration };
const auth = { jwt, cors };


const lib = { include, Chess, Macro, Enums, preset, utils, gameUtils, conn};

export { include, Chess, Macro, Enums, preset, utils, gameUtils, conn, auth };
export default lib;
