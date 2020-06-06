import knex from "../database/conection";
import {Request, Response} from "express";

class CollectorPointsController{

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