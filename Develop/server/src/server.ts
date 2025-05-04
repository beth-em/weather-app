import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import cors from "cors";    // allow client and server to make requests on different ports

dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,DELETE,PUT",
        allowedHeaders: "Content-Type"
    })
);

// TODO: Implement middleware to connect the routes
app.use('/api', routes);

// Catch all routes to server the frontend
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
