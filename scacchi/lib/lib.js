const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const {preset} = require("../Classes/Pieces/pieces.js");

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
const {eTeam, enumNames, enumValues} = require("../Macro/enums.js");
const Enums = {eTeam, enumValues, enumNames};

//SECTION - utils function
let utils = require("../utils.js");


module.exports = {include, Chess, Macro, Enums, preset, utils};