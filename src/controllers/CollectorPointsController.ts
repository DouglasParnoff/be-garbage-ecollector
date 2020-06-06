import knex from "../database/conection";
import {Request, Response, response} from "express";

class CollectorPointsController{
    
    async index (request: Request, response: Response) {
        const {city, uf, itemTypes} = request.query;

        const parsedItemTypes = String(itemTypes)
            .split(",")
            .map( i => Number(i.trim()));

        const collectorPoints = await knex("collector_point")
            .join("collector_item_type", "collector_point.id"
                    , "=", "collector_item_type.collector_point_id")
            .whereIn("collector_item_type.item_type_id", parsedItemTypes)
            .where("uf", String(uf))
            .where("city", String(city))
            .distinct()
            .select("collector_point.*")

        return response.json(collectorPoints);
    }

    async show (request: Request, response: Response) {
        const {id} = request.params;

        const collectorPoint = await knex("collector_point").where("id", id).first();

        if(!collectorPoint){
            return response.status(400).json(
                {
                    "message" : "Collector point not found" 
                }
            );
        }

        const itemTypes = await knex("item_type")
            .join("collector_item_type", "item_type.id","collector_item_type.item_type_id")
            .where("collector_item_type.collector_point_id", id);
        
        collectorPoint.items = itemTypes;

        return response.json(collectorPoint);
    }

    async create (request: Request, response: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const knexTrx = await knex.transaction();

        const collectorPoint = {
            image : "fake",
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        
        const insertedId = await knexTrx("collector_point").insert(collectorPoint);

        const collectorPointId = insertedId[0];

        const collectorItemTypes = items.map((item: number) => {
            return {
                item_type_id: item, 
                collector_point_id: collectorPointId
            }
        });
        
        await knexTrx("collector_item_type").insert(collectorItemTypes)
            .then(knexTrx.commit)
            .catch(knexTrx.rollback);

        return response.json({ 
            id: collectorPointId,
            ...collectorPoint
        }); 
    }
}

export default CollectorPointsController;