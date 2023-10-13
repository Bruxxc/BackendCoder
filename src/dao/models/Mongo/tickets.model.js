import { TicketMongoose } from "../Mongoose/ticket.mongoose.js";

export class TicketsModel{

    async getAll(){
        try{
            const tickets=await TicketMongoose.find({})
            return tickets;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getByPurchaser(purchaser){
        try{
            const tickets= await TicketMongoose.find({"purchaser":purchaser});
            return tickets;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getById(id){

        try{
            const ticket= await TicketMongoose.find({"_id":id}).lean();
            return ticket;
        }
        catch(e){
            console.log(e);
            throw e;
        }

    };

    async create(ticket){
        try{ 
            
            let ticketCreated = await TicketMongoose.create(ticket);
            return ticketCreated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async update(id,info){
        try{
            const ticketUpdated = await TicketMongoose.updateOne(
                { _id: id },
                {info}
            );
            return ticketUpdated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async delete(id){
        try{
            const ticketDeleted = await TicketMongoose.deleteOne({"_id":id});
            return ticketDeleted;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };
    
}