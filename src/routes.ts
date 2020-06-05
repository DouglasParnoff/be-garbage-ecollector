import express from 'express';
const routes = express.Router();

const users = [
    "Mamama", "Nenene", "Tatata"
];

routes.get(
    "/users", (request, response) => {
        console.log("endpoint: " + request.url);
        
        let result = users;
        
        const qryFilter = request.query;
        
        result = filterUsers(qryFilter, users);

        return response.json({
            "users" : result
        });
    } 
);

routes.get(
    "/users/:id", (request, response) => {
        let id = Number(request.params.id);
        console.log("endpoint: " + request.url);
        return response.json({
            "user" : users[id]
        });
    } 
);

function filterUsers(filter: any, users: Array<string>){

    for(let currentKey in filter){
        users = users.filter(u => u.includes(filter[currentKey]));
    }
    return users;
}

export default routes;