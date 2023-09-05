import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import {
	findAllRelawanTim,
	allRelawanTim,
	findOneRelawanTim,
	findAllRelawanMember,
} from "../controllers/relawan-tim/find";
import { createRelawanTim } from "../controllers/relawan-tim/create";
import { removeRelawanTim } from "../controllers/relawan-tim/remove";
import { updateRelawanTim } from "../controllers/relawan-tim/update";

export const relawanTimRouter = (app: Express) => {
	const router = express.Router();
	app.use("/relawan-tim", middleware.useAuthorization, router);
	router.get("/list", (req: Request, res: Response) => findAllRelawanTim(req, res));
	router.get("/all", (req: Request, res: Response) => allRelawanTim(req, res));
	router.get("/members/:relawanTimName", (req: Request, res: Response) =>
		findAllRelawanMember(req, res)
	);
	router.get("/detail/:id", (req: Request, res: Response) =>
		findOneRelawanTim(req, res)
	);
	router.post("/", (req: Request, res: Response) => createRelawanTim(req, res));
	router.patch("/", (req: Request, res: Response) => updateRelawanTim(req, res));
	router.delete("/", (req: Request, res: Response) => removeRelawanTim(req, res));
};
