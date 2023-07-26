import { MsgModel } from "../Mongoose/messages.mongoose";

export class MsgModel {
    async getAll(){
        try{
        const msgs= await MsgModel.find({});
        return msgs;}
        catch(e){
            console.log(e);
            throw e;
        }
    }

    async create(text,userName){
        try{
        const createmsg= await MsgModel.create({"text":text, "userName":userName});
        return createmsg;}
        catch(e){
            console.log(e);
            throw e;
        }
    }
}