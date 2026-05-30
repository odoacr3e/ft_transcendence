import http from "http";
import https from "https";
import url from "url";
import fs from "fs";
import path from "path";
import express from "express";
const app = express();

// NOTE: connections
import { prisma } from "./prisma.js";
//const { redis } = require("./redis.js");
const redis = {};
import crypto from "crypto";

//SECTION - external inclusions
const include = {http, https, url, fs, path, express, app};

//SECTION - chess classes/objects
import {Piece} from "../Classes/Pieces/pieces.js";
import {Preset, preset} from "../Classes/Pieces/preset.js";
import {Cursor} from "../Classes/Match/cursor.js";
import {includesOneOf} from "../utils/string.js";
import {ChessBoard, Square, initBoard, copyBoard, copyBoostedTargetZones} from "../Classes/ChessBoard/chessBoard.js";
const Chess = {Piece, Preset, preset, ChessBoard, initBoard, copyBoard, copyBoostedTargetZones, Cursor, Square};

//SECTION - macro
import * as Macro from "../Macro/macro.js";

//SECTION - Enums
import * as Enums from "../Macro/enums.js";

//SECTION - utils function
import * as utils from "../utils/moveUtils.js";
import {bastardChecks, isDangerous} from "../utils/gameUtils.js";
let gameUtils = {bastardChecks, isDangerous};

const conn = { prisma, redis, crypto } 

const lib = { include, Chess, Macro, Enums, preset, utils, gameUtils, conn};

export { include, Chess, Macro, Enums, preset, utils, gameUtils, conn};
export default lib;
