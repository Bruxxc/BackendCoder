import { Schema, model } from "mongoose";

const schema = new Schema({
  num:{type:Number},
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


schema.pre('findOne', function () {
  this.populate('products.product');
});

schema.pre('find', function () {
  this.populate('products.product');
});


export const CartModel = model("cart", schema);
