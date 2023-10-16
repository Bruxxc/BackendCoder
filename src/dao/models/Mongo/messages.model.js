import { MsgMongoose } from "../Mongoose/messages.mongoose.js";

export class MsgsModel {
    async getAll(){
        try{
            const msgs= await MsgMongoose.find({});
            return msgs;
        }
        catch(e){
            throw e;
        }
    }

    async create(text,userName){
        try{
            const createmsg= await MsgMongoose.create({"text":text, "userName":userName});
            return createmsg;
        }
        catch(e){
            throw e;
        }
    }
}