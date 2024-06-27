// IMPORTS
import express from "express"
import mongoose from "mongoose"
import { configDotenv } from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"
import cors from "cors"
import router from "./routes/routes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

configDotenv({ path: `${__dirname}/.env` });

const app = express()

// Configuration

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(router)

// MongoDB connection

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycluster.pyhihoy.mongodb.net/byte8?retryWrites=true&w=majority&appName=myCluster`

mongoose.connect(uri, clientOptions)
.then(() => console.log('Conexão com o MongoDB estabelecida!'))
.catch((error) => console.log(error.message))


// Application


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});