import winston from "winston";
import env from "../config/enviroment.config.js";

const logger = winston.createLogger({

    transports: [

        ////LOS DE NIVEL MAYOR O IGUAL A HTTP SE MUESTRAN EN LA CONSOLA
        new winston.transports.Console({level:env.logger}),
        

        ////LOS DE NIVEL MAYOR O IGUAL A WARN SE REGISTRAN EN ERRORS.LOG
        new winston.transports.File({filename:'./src/errors/errors.log',level:'warn'})
    ]

})


export const addLogger= (req,res,next) =>{
    req.logger=logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}