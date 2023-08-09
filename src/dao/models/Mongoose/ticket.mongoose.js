import { Schema, model } from "mongoose";

const schema = new Schema({
    code: { type: String, required: true, max: 100 },
    purchase_datetime: { type: String, required: true, max: 100 },
    amount: {type: Number, required: true},
    purchaser:{ type: String, required: true, max: 100 },
    products: { 
        type: [
              {
            
              product: {
              type:Schema.Types.ObjectId,
              ref: 'product',
              },
              quantity:{type:Number}
    
            },
    
        ], 
        default: [] 
      },
});

export const TicketMongoose = model("ticket", schema);
