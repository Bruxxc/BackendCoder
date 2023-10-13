import express from "express";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
import { TicketService } from "../services/Ticket.service.js";
import { MDBCartManager } from "../dao/helpers/MDBManagers/MDBCartManager.js";

const TService= new TicketService();
const CManager= new MDBCartManager();
export const viewsRouter = express.Router();
 
  //// PERFIL DE USUARIO
viewsRouter.get("/profile", async (req,res)=>{
    try{
      const email=req.session.email;
      if(email){
        const userInfo=await UserMongoose.findOne({email:email});
        let documents=userInfo.documents;
        ///CHECKEAR LOS DOCUMENTOS SUBIDOS
        const hasIdentification = documents.some((doc) => doc.name === "Identification");
        const hasAddress = documents.some((doc) => doc.name === "Address");
        const hasAccountStatus = documents.some((doc) => doc.name === "Account Status");
        const style="userProfile.css";
        const isAdmin= userInfo.role=="admin";
        const isUser=!isAdmin;
        return res.status(200).render('userProfile',{
          style: style,
          uid:userInfo._id,
          username: userInfo.userName,
          email: email,
          role: userInfo.role,
          firstname: userInfo.firstName,
          lastname: userInfo.lastName,
          hasIdentification:hasIdentification,
          hasAddress:hasAddress,
          hasAccountStatus:hasAccountStatus,
          isAdmin:isAdmin,
          isUser:isUser
          
        });
      }
      else{
        return res.redirect('/views/sessions/login');
      }
    }
    catch(e){
      console.log(e);
      throw e;
    }
});

//// MOSTRAR CARRITO
viewsRouter.get("/viewCart", async (req,res)=>{
  try{
    const email=req.session.email;
    if(email){ 
      const user=await UserMongoose.findOne({email:email});
      return res.redirect(`/views/carts/${user.cart}`);
    }
    else{
      return res.redirect('/views/sessions/login');
    }
  }
  catch(e){
    console.log(e);
    throw e;
  }
});

/// PÁGINA DE PAGO
viewsRouter.get("/payment-intent", async (req,res)=>{
  try{
    
    if(req.session.user){
      let cid=req.session.cart;
      let cartData= await CManager.cartCheckStock(cid);
      if(cartData.amount==0){
        return res.redirect('/views/products');
      }
      else{
        const style="payment.css";
        return res.status(200).render('payment',{style});
      }
  }
    else{
      return res.redirect('/views/products');
    }
  }
  catch(e){
    throw e;
  }
});

/// VISUALIZAR TICKET DE COMPRA
viewsRouter.get("/ticket/:tid", async (req,res)=>{
  const tid=req.params.tid;
  const email=req.session.email;
  try{
    const ticket= await TService.getById(tid);
    console.log('TICKET--->',ticket);
    if(!ticket[0] || !email || email!=ticket[0].purchaser){
      console.log('NO ESTA LOGGEADO O NO SE ENCUENTRA EL TICKET');
      return res.redirect('/views/products');
    }
    else{
      const style="viewTicket.css";
      let username=req.session.user;
      let products=ticket[0].products;
      let amount=ticket[0].amount;
      let date=ticket[0].purchase_datetime;
      const fechaOriginal = new Date(date);

      // Opciones de formato
      const opcionesDeFormato = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      };

      const formatoLegible = fechaOriginal.toLocaleString('es-UY', opcionesDeFormato);
      return res.render('viewTicket',{style:style,username:username,products:products,amount:amount,date:formatoLegible});
    }
  }
  catch(e){
    throw e;
  }

});
