"use strict";

import * as async from "async";
import { Response, Request, NextFunction, Router } from "express";

import Sequelize from "sequelize"

const sequelize = new Sequelize('js_talks_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false
})

sequelize.query("SELECT * FROM users").then(datas => {
    console.log('Query result', datas)
})

// const mysql = require('mysql');

// const connection = mysql.createConnection({
//     // port: 3306,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'js_talks_db'
// });

// connection.connect();

// connection.query('SELECT * FROM users', (error, results, fields) => {
    // if (error) throw error;
    // console.log('The solution is: ', results);
// });

// connection.end();

// const db = require("../db-mocks.json");

/**
 * GET /api
 * List of API examples.
 */
const router = Router();

// HOME

// router.get("/", (req: Request, res: Response) => {
//     res.json();
// });

// // TALKS

// router.get("/talks", (req: Request, res: Response) => {
//     const err = db.talks ? false : true;
//     if (err) res.status(404).send("Talks not found");
//     res.status(200).send(db.talks);
// });

export default router;
