import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { findAllUsers, findOneUser } from "../controllers/users/find";
import { updateUser } from "../controllers/users/update";
import { removeUser } from "../controllers/users/remove";
import { createUser } from "../controllers/users/create";

export const userRouter = (app: Express) => {
	const router = express.Router();
	app.use("/users", middleware.useAuthorization, router);
	router.get("/list", (req: Request, res: Response) => findAllUsers(req, res));
	router.get("/detail/:userId", (req: Request, res: Response) => findOneUser(req, res));
	router.post("/", (req: Request, res: Response) => createUser(req, res));
	router.patch("/", (req: Request, res: Response) => updateUser(req, res));
	router.delete("/", (req: Request, res: Response) => removeUser(req, res));
};
