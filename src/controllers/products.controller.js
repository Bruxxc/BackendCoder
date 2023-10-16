import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";
import { transportMailer } from "../app.js";
const PManager= new MDBProductManager;

export class ProductsController{
    
    async getAll(req,res){
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let sort = req.query.sort || "";
    
        try {
        let filter = {};
        const products = await PManager.getProducts(filter,limit,page,sort);
    
        return res.status(200).json({
            status: "success",
            payload:products.docs,
            totalDocs:products.totalDocs,
            limit:products.limit,
            totalPages: products.totalPages,
            page: products.page,
            pagingCounter: products.pagingCounter,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
        });
        } catch (error) {
        req.logger.error(`ERROR AT GETTINGS PRODUCTS---> ${e}`);
        return res.status(500).json({
            status: "error",
            msg: "Failed to retrieve products",
            error: error.message,
        });
        }
    };

    async getById(req,res){
        let id=req.params.pid;
        try {
        const product = await PManager.getProductById(id);
            return res.status(200).json({
            status: "success",
            msg: "product found",
            data: product,
            });
        } catch (e) {
            req.logger.error(`ERROR AT GETTING PRODUCT---> ${e}`);
        return res.status(500).json({
            status: "error",
            msg: e.message,
            data: {},
        });
        }
    };

    async create(req,res){
        const { title, description, price, code, stock, category, thumbnail } = req.body;
        try {
        const productCreated = await PManager.createProduct(title, description, price, code, stock ,category, thumbnail);
        return res.status(201).json({
            status: "success",
            msg: "product created",
            id:productCreated._id
        });
        } catch (e) {
        req.logger.error(`ERROR AT CREATING PRODUCT---> ${e}`);
        return res.status(500).json({
            status: "error",
            msg: e.message,
            data: {}
        });
        }
    };

    async update(req,res){
        const { id } = req.params;
        const { title, description, price, stock, category, thumbnail, status } = req.body;

        try {
        const productUpdated = await PManager.editProduct(id,title,description,price,stock,category,thumbnail,status);
        return res.status(200).json({
            status: "success",
            msg: "product updated",
        });
        } catch (e) {
        req.logger.error(`ERROR AT UPDATING PRODUCT---> ${e}`);
        return res.status(500).json({
            status: "error",
            msg: e.message,
            data: {},
        });
        }
    };

    async delete(req,res){
        const id=req.params.pid;

        try{
            ////si el usuario es premium, se manda un mail al eliminar
            let product= await PManager.getProductById(id);
            product=product[0];
            if(product.owner!="admin"){
                    const mail={
                        from: "elbrunoconde@gmail.com",
                        to: product.owner,
                        subject: "SU PRODUCTO HA SIDO ELIMINADO",
                        html: `
                                  <div>
                                      <h2>SU PRODUCTO ${product.title} HA SIDO ELIMINADO</h2>
                                      <h5>FLAMING</h5>
                                  </div>
                              `,
                    }
                	const result = await transportMailer.sendMail(mail)
            }
            const productDeleted = await PManager.deleteProduct(id);
            return res.status(200).json({
            status: "success",
            msg: "product deleted",
            product:product
            });
            
        } catch (e) {
            req.logger.error(`ERROR AT DELETING PRODUCT---> ${e}`);
            return res.status(500).json({
            status: "error",
            msg: e.message,
            data: {},
            });
        }
    }


}
    