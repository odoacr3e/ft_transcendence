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
const {Board} = require("./chessBoard.js");
const {Square} = require("./chessBoard.js");
const Chess = {Piece, Board, Square};

//SECTION - macro
const {Macro} = require("./macro.js");

//SECTION - Enums
const Enums = {eTeam} = require("./chessBoard.js");


module.exports = {include, Chess, Macro, Enums};