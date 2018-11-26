import * as express from 'express';
import { Application } from "express";
import { initRestApi } from "./api/api";

const bodyParser = require('body-parser');

require('dotenv').config();

const app: Application = express();

//Because heroku
const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());


initRestApi(app);

app.listen(PORT, () => {
	console.log(`Server is now running on port ${PORT} ...`);
});