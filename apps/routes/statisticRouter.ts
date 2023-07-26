import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { statistic } from "../controllers/statistic";

export const statisticRouter = (app: Express) => {
	const router = express.Router();
	app.use("/statistic", middleware.useAuthorization, router);
	router.get("/", (req: Request, res: Response) => statistic(req, res));
};
