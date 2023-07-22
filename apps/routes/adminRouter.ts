import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { findAllAdmin } from "../controllers/admin/findAll";
import { loginAdmin } from "../controllers/admin/login";
import { createAdmin } from "../controllers/admin/creat";
import { updateAdmin } from "../controllers/admin/update";
import { removeAdmin } from "../controllers/admin/remove";

export const adminRouter = (app: Express) => {
	const router = express.Router();
	app.use("/admins", middleware.useAuthorization, router);
	router.get("/list", (req: Request, res: Response) => findAllAdmin(req, res));
	router.post("/login", (req: Request, res: Response) => loginAdmin(req, res));
	router.post("/", (req: Request, res: Response) => createAdmin(req, res));
	router.patch("/", (req: Request, res: Response) => updateAdmin(req, res));
	router.delete("/", (req: Request, res: Response) => removeAdmin(req, res));
};
