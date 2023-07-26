import { Express, Request, Response } from "express";
import { index } from "../controllers";
import { adminRouter } from "./adminRouter";
import { userRouter } from "./userRouter";
import { statisticRouter } from "./statisticRouter";
import { regionRouter } from "./regionRouter";
import { myProfileRouter } from "./myProfileRouter";

export const route = (app: Express) => {
	app.get("/", (req: Request, res: Response) => index(req, res));
	adminRouter(app);
	userRouter(app);
	statisticRouter(app);
	regionRouter(app);
	myProfileRouter(app);
};
