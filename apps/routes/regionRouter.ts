import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { findKabupaten } from "../controllers/region/findKabupaten";
import { findKecamatan } from "../controllers/region/findKecamatan";
import { findDesa } from "../controllers/region/findDesa";

export const regionRouter = (app: Express) => {
	const router = express.Router();
	app.use("/region", middleware.useAuthorization, router);
	router.get("/kabupaten", (req: Request, res: Response) => findKabupaten(req, res));
	router.get("/kecamatan", (req: Request, res: Response) => findKecamatan(req, res));
	router.get("/desa", (req: Request, res: Response) => findDesa(req, res));
};
