import { Router, type IRouter } from "express";
import healthRouter from "./health";
import packagesRouter from "./packages";
import consultationsRouter from "./consultations";
import contactsRouter from "./contacts";
import tradelineRouter from "./tradeline";
import clientRouter from "./client";
import adminRouter from "./admin";
import addOnsRouter from "./add-ons";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/packages", packagesRouter);
router.use("/consultations", consultationsRouter);
router.use("/contacts", contactsRouter);
router.use("/tradeline", tradelineRouter);
router.use("/clients", clientRouter);
router.use("/admin", adminRouter);
router.use("/add-ons", addOnsRouter);
router.use("/newsletter", newsletterRouter);

export default router;
