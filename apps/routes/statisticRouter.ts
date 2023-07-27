import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { getKabupatenStatistic } from "../controllers/statistic/getKabupaten";
import { getKecamatanStatistic } from "../controllers/statistic/getKecamatan";
import { getDesaStatistic } from "../controllers/statistic/getDesa";

export const statisticRouter = (app: Express) => {
	const router = express.Router();
	app.use("/statistic", middleware.useAuthorization, router);
	router.get("/", (req: Request, res: Response) => getKabupatenStatistic(req, res));
	router.get("/kecamatan", (req: Request, res: Response) =>
		getKecamatanStatistic(req, res)
	);
	router.get("/desa", (req: Request, res: Response) => getDesaStatistic(req, res));
};
