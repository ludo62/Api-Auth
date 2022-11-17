// Importations des dépendances
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lancement du serveur
const PORT = process.env.PORT;

const start = async () => {
	try {
		await connectDB();
		console.log('DB connected');
		app.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
	} catch (error) {
		console.log(error);
	}
};
start();
