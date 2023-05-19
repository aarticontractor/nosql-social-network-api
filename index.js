const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const cwd = process.cwd();

const PORT = process.env.port || 3001;
const app = express();


