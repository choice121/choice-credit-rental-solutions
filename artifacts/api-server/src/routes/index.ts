import { Router, type IRouter } from "express";
import healthRouter from "./health";
import packagesRouter from "./packages";
import consultationsRouter from "./consultations";
import contactsRouter from "./contacts";
import tradelineRouter from "./tradeline";
import clientRouter from "./client";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/packages", packagesRouter);
router.use("/consultations", consultationsRouter);
router.use("/contacts", contactsRouter);
router.use("/tradeline", tradelineRouter);
router.use("/clients", clientRouter);
router.use("/admin", adminRouter);

export default router;
