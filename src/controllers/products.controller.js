import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";

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
            data: productCreated,
        });
        } catch (e) {
        req.logger.error(`ERROR AT CREATING PRODUCT---> ${e}`);
        return res.status(500).json({
            status: "error",
            msg: e.message,
            data: {},
        });
        }
    };

    async update(req,res){
        const { id } = req.params;
        const { title, description, price, stock, category, thumbnail, status } = req.body;

        try {
        const productUpdated = await PManager.editProduct(id,title,description,price,stock,category,thumbnail,status);
        return res.status(201).json({
            status: "success",
            msg: "product updated",
            data: productUpdated,
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
            const productDeleted = await PManager.deleteProduct(id);
            return res.status(201).json({
            status: "success",
            msg: "product deleted",
            info:productDeleted
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
    