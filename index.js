import express from "express";

import dotenv from "dotenv";
import initApp from "./src/initApp.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.set("case sensitive routing", true);
initApp(app, express);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT} `);
});
