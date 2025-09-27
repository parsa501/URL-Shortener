import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import uploadRouter from "./Routes/Upload.js";
import { catchError, HandleERROR } from "vanta-api";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./Utils/Swagger.js";
import urlrouter from "./Routes/Url.js";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("Public"));

app.use("/api/uploads", uploadRouter);
app.use("/api/url", urlrouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((req, res, next) => {
  return next(new HandleERROR("Not Found", 404));
});
app.use(catchError);
export default app;
