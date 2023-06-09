import "dotenv/config";
import express from "express";
import usersRoutes from "routes/UserRoute";
import accountRoutes from "routes/AccountRoute"
import suportRoutes from "routes/SuportRoute"
import { authentication } from "middlewares/auth";
import { DateTime } from "luxon";

DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.use("/users", usersRoutes);
app.use("/account", accountRoutes)
app.use("/suport", suportRoutes)

app.listen(process.env.PORT || 3344);
