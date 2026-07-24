import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express"
import { connectDB } from "./config/db.js";
import { authRoute } from "./routes/auth.route.js";
import { swaggerDocs } from "./config/swagger.js";
import { gymRoute } from "./routes/gym.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

//connect DB
connectDB();

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Fitness Aggregator Platform  backend API is running.",
    });
});

//swager setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



//auth route
app.use('/api', authRoute)
//gym route
app.use('/api', gymRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT} `);
    console.log(`swagger API documentation running on http://localhost:${PORT}/api-docs `);
})