import { TicketService } from "../services/Ticket.service.js";
import { genRandomCode } from "../utils.js";
import { MDBCartManager } from "../dao/helpers/MDBManagers/MDBCartManager.js";
const TService= new TicketService;
const CManager= new MDBCartManager;

export class TicketsController{

    async getAll(req,res){  
        try {
            const tickets=await TService.getAll();
            return res.status(200).json({
              status: "success",
              msg: "tickets list",
              data: tickets,
            });
        } catch (e) {
            req.logger.error(`ERROR AT GETTING TICKETS--->${e}`);
            return res.status(500).json({
              status: "error",
              msg: "something went wrong :(",
              data: {},
            });
        }
    };

    async getById(req,res){
        
        let id=req.params.tid;
    
        try {
            const ticket =await TService.getById(id);
            if(ticket.length==0){
                return res.status(201).json({
                    msg: "ticket not found",
                });
            }
            else{
                return res.status(200).json({
                    status: "success",
                    msg: "ticket found",
                    data: ticket,
                });
            }

    
        } catch (e) {
            req.logger.error(`ERROR AT GETTING TICKET--->${e}`);
            return res.status(500).json({
            status: "error",
            msg: e.message,
            data: {},
            });
        }

    };

    async create(req,res){
        let amount=req.body.amount;
        let purchaser=req.body.purchaser;
        let products=JSON.parse(req.body.products);
        try{
            if(!amount || !purchaser){
                return res.status(201).json({
                    status: "error",
                    msg: "provide amount and purchaser info",
                });
            }
            else{
                let code=genRandomCode();
                let purchase_datetime= new Date;

                const newTicket={
                    code:code,
                    purchase_datetime:purchase_datetime,
                    amount:amount,
                    purchaser:purchaser,
                    products:products
                }
                const ticketCreated = await TService.create(newTicket);
                
                return res.status(201).json({status:"Success",msg:"Ticket created", data:ticketCreated});
            }   
        } catch (e) {
            req.logger.error(`ERROR AT CREATING TICKET--->${e}`);
            return res.status(500).json({
                status: "error",
                data: {},
            });
        }
    }

}