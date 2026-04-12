const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
//const utils = require('./net.js');
const express = require('express');
const app = express();

//SECTION - external inclusions
const include = {http, https, url, fs, path, express, app};

//SECTION - chess classes/objects

const {Piece} = require("./pieces.js");
const {cursor} = require("./cursor.js");
const {board, Square} = require("./chessBoard.js");
const Chess = {Piece, board, cursor, Square};

//SECTION - macro
const Macro = require("./macro.js");

//SECTION - Enums
const {eTeam} = require("./chessBoard.js");
const {enumValues, enumNames} = require("./pieces.js");
const Enums = {eTeam, enumValues, enumNames};

module.exports = {include, Chess, Macro, Enums};