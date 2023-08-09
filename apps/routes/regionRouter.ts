import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { findKabupaten } from "../controllers/region/findKabupaten";
import { findKecamatan } from "../controllers/region/findKecamatan";
import { findDesa } from "../controllers/region/findDesa";
import { findUnRegisteredRegion } from "../controllers/region/findUnRegisteredRegion";

export const regionRouter = (app: Express) => {
	const router = express.Router();
	app.use("/region", middleware.useAuthorization, router);
	router.get("/kabupaten", (req: Request, res: Response) => findKabupaten(req, res));
	router.get("/kecamatan", (req: Request, res: Response) => findKecamatan(req, res));
	router.get("/desa", (req: Request, res: Response) => findDesa(req, res));
	router.get("/unregistered", (req: Request, res: Response) =>
		findUnRegisteredRegion(req, res)
	);
};
