import express, { Express, Request, Response } from "express";
import { middleware } from "../middlewares";
import { findWaBlasSettings } from "../controllers/waBlass/findWaBlasSettings";
import { createOrUpdateWaBlassSettings } from "../controllers/waBlass/createOrUpdateWaBlasSettings";
import { waBlasSendMessage } from "../controllers/waBlass/sendMessage";
import { waBlasSendMessageTest } from "../controllers/waBlass/sendMessageTest";

export const waBlasRouter = (app: Express) => {
	const router = express.Router();
	app.use("/wa-blas", middleware.useAuthorization, router);
	router.post("/send-message", (req: Request, res: Response) =>
		waBlasSendMessage(req, res)
	);
	router.get("/settings", (req: Request, res: Response) =>
		findWaBlasSettings(req, res)
	);
	router.patch("/settings", (req: Request, res: Response) =>
		createOrUpdateWaBlassSettings(req, res)
	);
	router.post("/send-message-test", (req: Request, res: Response) =>
		waBlasSendMessageTest(req, res)
	);
};
