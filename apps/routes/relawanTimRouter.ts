import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { findAllRelawanTim, allRelawanTim } from "../controllers/relawan-tim/find";
import { createRelawanTim } from "../controllers/relawan-tim/create";
import { removeRelawanTim } from "../controllers/relawan-tim/remove";

export const relawanTimRouter = (app: Express) => {
	const router = express.Router();
	app.use("/relawan-tim", middleware.useAuthorization, router);
	router.get("/list", (req: Request, res: Response) => findAllRelawanTim(req, res));
	router.get("/all", (req: Request, res: Response) => allRelawanTim(req, res));
	router.post("/", (req: Request, res: Response) => createRelawanTim(req, res));
	// router.patch("/", (req: Request, res: Response) => updateUser(req, res));
	router.delete("/", (req: Request, res: Response) => removeRelawanTim(req, res));
};
