import express from "express";
import knex from "./database/conection"

import CollectorPointsController from "./controllers/CollectorPointsController";
import ItemTypesController from "./controllers/ItemTypesController";

const routes = express.Router();

const collectorPointsController = new CollectorPointsController();
const itemTypesController = new ItemTypesController();

routes.get(
    "/itemTypes", itemTypesController.index
);

routes.get("/collectorPoints", collectorPointsController.index);

routes.get("/collectorPoints/:id", collectorPointsController.show);

routes.post("/collectorPoints", collectorPointsController.create);

export default routes;