import { Express, Request, Response } from "express";
import { index } from "../controllers";
import { middleware } from "../middlewares";
import { adminRouter } from "./adminRouter";

export const route = (app: Express) => {
	app.get("/", middleware.useAuthorization, (req: Request, res: Response) =>
		index(req, res)
	);
	adminRouter(app);
};
