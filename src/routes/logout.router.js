import express from "express";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
export const logoutRouter = express.Router();

///LOGOUT
logoutRouter.get("/", async (req,res)=>{
    try{
      req.logger.info("log out");
      const email=req.session.email;
      const timestamp = Date.now(); // Obtiene la marca de tiempo actual
      // Crea una instancia de la clase Date utilizando el timestamp
      const fecha = new Date(timestamp);

      // Define el formato deseado de fecha
      const opcionesDeFormato = {
        year: 'numeric', // Año
        month: 'long',   // Mes (nombre completo)
        day: 'numeric',  // Día del mes
        hour: '2-digit', // Hora (formato de dos dígitos)
        minute: '2-digit', // Minutos (formato de dos dígitos)
        second: '2-digit', // Segundos (formato de dos dígitos)
      };
      // Aplica el formato a la fecha
      const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesDeFormato);
      const updateUser=await UserMongoose.updateOne({email:email},{last_connection:fechaFormateada});
      req.session.destroy((err) => {
        if (err) {
          console.error("Error Loggin out", err);
        }
        res.redirect("/views/products");
      });
    }
    catch(e){
      console.log(e);
      throw e;
    }
});