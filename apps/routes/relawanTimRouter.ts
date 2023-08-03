import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { findAllRelawanTim, findOneRelawanTim } from "../controllers/relawan-tim/find";
import { createRelawanTim } from "../controllers/relawan-tim/create";

export const relawanTimRouter = (app: Express) => {
	const router = express.Router();
	app.use("/relawan-tim", middleware.useAuthorization, router);
	router.get("/list", (req: Request, res: Response) => findAllRelawanTim(req, res));
	router.get("/detail/:relawanTimId", (req: Request, res: Response) =>
		findOneRelawanTim(req, res)
	);
	router.post("/", (req: Request, res: Response) => createRelawanTim(req, res));
	// router.patch("/", (req: Request, res: Response) => updateUser(req, res));
	// router.delete("/", (req: Request, res: Response) => removeUser(req, res));
};
