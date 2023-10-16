import {MDBCartManager} from "../dao/helpers/MDBManagers/MDBCartManager.js";

const CManager= new MDBCartManager;

export class CartsController{

    async getAll(req,res){
        try {
            const carts=await CManager.getCarts();
            return res.status(200).json({
              status: "success",
              msg: "carts list",
              data: carts,
            });
          } catch (e) {
            req.logger.error(e);
            return res.status(500).json({
              status: "error",
              msg: "something went wrong :(",
              data: {},
            });
          }
    };

    async getById(req,res){
    
        let id=req.params.cid;
    
        try {
            const cart =await CManager.getCartById(id);
            return res.status(200).json({
            status: "success",
            msg: "cart found",
            data: cart,
            });

        } catch (e) {
            req.logger.error(e);
            return res.status(500).json({
            status: "error",
            msg: e.message,
            error:e,
            data: {},
            });
        }
    };

    async create(req,res){
        try{
            const cartCreated = await CManager.createCart();
            return res.status(201).json({status:"success",msg:"Cart created",id:cartCreated._id ,data:cartCreated});
          } catch (e) {
              req.logger.error(e);
              return res.status(500).json({
                status: "error",
                error:e,
                msg: error.message,
                data: {},
              });
        }
    };

    async update(req,res){
        let cid=req.params.cid;
        let products=req.body;
        try{
            const editCart= await CManager.addProductsArray(cid,products);
            return res.status(200).json({
            status: "success",
            msg: "cart updated",
            });
        }
        catch(e){
            req.logger.error(e);
            return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            error:e,
            data: {},
            });
        }
    };

    async addProduct(req,res){
        let cid=req.params.cid;
        let pid=req.params.pid;

        try {
            const editCart= await CManager.addProductToCart(pid,cid);

            return res.status(200).json({
                status: "success",
                msg: "cart updated",
            });

        } catch(e){
            req.logger.error(e);
            return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            error:e,
            data: {},
            });

        }

    };

    async deleteProduct(req,res){

        let cid=req.params.cid;
        let pid=req.params.pid;
      
        try {
            
            const editCart= await CManager.deleteProductFromCart(pid,cid);
            return res.status(200).json({
                status: "success",
                msg: "cart updated",
              });
      
        } catch(e){
            req.logger.error(e);
            return res.status(500).json({
              status: "error",
              msg: "something went wrong :(",
              error:e,
              data: {},
            });
      
        }

    };

    async emptyCart(req,res){
        let cid=req.params.cid;
        try {
            
            const editCart=await CManager.emptyCart(cid);
            return res.status(200).json({
                status: "success",
                msg: "cart emptied"
            });

        } catch(e){
            req.logger.error(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                error:e,
                data: {},
            });

        }

    };

    async editProductQuantity(req,res){
        let cid=req.params.cid;
        let pid=req.params.pid;
        let {newquant}=req.body;

        try {
                const editCart= await CManager.editProductQuantity(cid,pid,newquant);
                return res.status(200).json({
                    status: "success",
                    msg: "cart updated",
                    data: {
                        cart:editCart,
                        product:pid,
                    },
                });

        } catch(e){
            req.logger.error(e);
            return res.status(500).json({
                status: "error",
                msg: e.message,
                data: {},
            });

        }
    };

    async purchase(req,res){
        let cid=req.params.cid;
        try{
            let stockInfo= await CManager.cartCheckStock(cid);
            const cart=await CManager.getCartById(cid);
            let esVacio;
            let amount=0;
            if(!esVacio){
                cart[0].products.forEach(product => {
                    amount=amount+((product.quantity)*(product.product.price));
                });
            }
            return res.status(200).json({
                status:"success",
                msg:"compra válida",
                stockInfo:stockInfo,
                amount:amount,
            });
        }
        catch (e) {
            req.logger.error(e);
            return res.status(500).json({
                status: "error",
                msg: e.message,
                data: {},
            });
        } 
    };

}