import { TicketsModel } from "../dao/models/Mongo/tickets.model.js";
const TModel= new TicketsModel;

export class TicketService{

    async getAll(){

        try{
           const tickets = await TModel.getAll();
           return tickets;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    async getByPurcharser(purchaser){
        try{
            const ticket= await TModel.getByPurchaser(purchaser);
            return ticket;            
        }

        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getById(id){

        try{
            const ticket= await TModel.getById(id);
            return ticket;            
        }

        catch(e){
            console.log(e);
            throw e;
        }
    };

    async create(ticket){
        try{
            const ticketCreated = await TModel.create(ticket);
            return ticketCreated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async update(id,info){
        try{
            const ticketUpdated = await TModel.update(id,info);
            return ticketUpdated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async delete(id){
        try{
            const ticketDeleted = await TModel.delete(id);
            return ticketDeleted;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }
}