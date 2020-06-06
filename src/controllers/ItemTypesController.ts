import {Request, Response} from "express";
import knex from "../database/conection";

class ItemTypesController{
    async index (request: Request, response: Response) {
        let itemTypes = await knex("item_type").select("*");

        let itemTypesDto = itemTypes.map(obj => {
            return {
                id: obj.id,
                title: obj.title,
                imageURL: `http://localhost:8069/uploads/${obj.image}`
            }
        });

        return response.json(itemTypesDto);
    } 
}

export default ItemTypesController;