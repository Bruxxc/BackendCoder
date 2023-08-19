import express from "express";
export const loggerRouter = express.Router();


loggerRouter.get('/',(req,res)=>{
///////ERROR Y WARN SON LOS DE MAYOR NIVEL
    req.logger.error("!!!!!!ERROR!!!!!");
    req.logger.warn("WARN!!!");
///////////
//////////
    req.logger.info("-->Info<--");
    req.logger.http("HTTP");
///////////////// LOS QUE ESTEN POR ARRIBA SE MOSTRARAN EN CONSOLA


    req.logger.verbose("Verbose");
    req.logger.debug("Debug");
    req.logger.silly("Silly");


    res.send({message:"Prueba de Logger"});
})