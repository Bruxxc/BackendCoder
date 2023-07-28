import { MsgsModel } from "../dao/models/Mongo/messages.model.js";
const MsgModel= new MsgsModel;

export class MsgService{
    async getAll(){
        try{
            const msgs = await MsgModel.getAll();
            return msgs;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    async create(text,userName){
        try{
        const createmsg= await MsgModel.create(text,userName);
        return createmsg;}
        catch(e){
            console.log(e);
            throw e;
        }
    }
}


