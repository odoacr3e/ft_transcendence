const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const {preset} = require("../Classes/Pieces/pieces.js");

// NOTE: connections
const { prisma } = require("./prisma.js");
const { redis } = require("./redis.js");
const crypto = require('crypto');

//SECTION - external inclusions
const include = {http, https, url, fs, path, express, app};

//SECTION - chess classes/objects
const {Piece} = require("../Classes/Pieces/pieces.js");
const {cursor} = require("../Classes/Vault/cursor.js");
const {includesOneOf} = require("../utils/string.js");
const {board, Square, copyBoard} = require("../Classes/ChessBoard/chessBoard.js");
const Chess = {Piece, board, copyBoard, cursor, Square};

//SECTION - macro
const Macro = require("../Macro/macro.js");

//SECTION - Enums
const Enums = require("../Macro/enums.js");

//SECTION - utils function
let utils = require("../utils/moveUtils.js");
let {bastardChecks, isDangerous} = require("../utils/gameUtils.js");
let gameUtils = {bastardChecks, isDangerous};

const conn = { prisma, redis, crypto } 

module.exports = { include, Chess, Macro, Enums, preset, utils, gameUtils, conn};