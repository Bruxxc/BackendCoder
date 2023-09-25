import express from "express";
import { UsersController } from "../controllers/users.controller.js";
import { isValidObjectId } from "mongoose";
import env from '../config/enviroment.config.js';
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
import { uploader } from "../utils.js";
export const usersRouter = express.Router();

const UController= new UsersController;
usersRouter.get("/", async (req, res) => {
 UController.getAll(req,res);
});

///HACE PREMIUM AL USUARIO ACTUAL
usersRouter.get("/premium", async(req,res)=>{
  const user=req.session.user;
  const role=req.session.role;
  const email=req.session.email;
    try{

          if(user){
          console.log(user);
          if(email==env.adminEmail){
              return res.send("ERES ADMIN");
          }

          else{
              if(role=="premium"){
                  return res.send("YA ERES PREMIUM");
              }

              else if(role=="user"){
                const checkUser = await UserMongoose.findOne({email:email});
                let documents=checkUser.documents;
                ///CHECKEAR LOS DOCUMENTOS SUBIDOS
                const hasIdentification = documents.some((doc) => doc.name === "Identification");
                const hasAddress = documents.some((doc) => doc.name === "Address");
                const hasAccountStatus = documents.some((doc) => doc.name === "Account Status");
                console.log("---> Has Identification:", hasIdentification);
                console.log("---> Has Address:", hasAddress);
                console.log("---> Has Account Status:", hasAccountStatus);
                ///SI TIENE TODOS LOS DOCUMENTOS, HACER PREMIUM
                if(hasAddress && hasAccountStatus && hasIdentification){
                  const premiumUpgrade= await UserMongoose.updateOne({email:email},{role:"premium"});
                  req.session.role="premium";
                  return res.send("SE TE HA OTORGADO EL RANGO DE PREMIUM");
                }
                ///SI NO, INDICAR DOCUMENTOS FALTANTES
                else{
                  let missing="";
                  if(!hasIdentification){
                    missing="IDENTIFICACIÓN//";
                  }
                  if(!hasAddress){
                    missing=missing + " COMPROBANTE DE DOMICILIO//";
                  }
                  if(!hasAccountStatus){
                    missing=missing + "COMPROBANTE DE ESTADO DE CUENTA";
                  }
                  return res.send(`DEBES SUBIR:${missing} para que se te pueda otorgar el rango de premium`);
                }
              }
          }
          }
          else{
          return res.redirect("/views/sessions/login");
          }

      }
      catch(e){
          console.log(e);
          throw e;
      }
});

///HACE PREMIUM AL USUARIO CON UID
usersRouter.get("/premium/:uid", async(req,res)=>{
  const uid=req.params.uid;
  try{
    if(isValidObjectId(uid)){
      const checkUser= await UserMongoose.findOne({_id:uid});
      if(checkUser){
        if(checkUser.role=="admin"){
          return res.send("USUARIO ADMIN");
        }
        else if(checkUser.role=="premium"){
          return res.send("ESE USUARIO YA ES PREMIUM");
        }
        else{
          const premiumUpgrade= await UserMongoose.updateOne({_id:uid},{role:"premium"});
          return res.send(`USUARIO ${uid} ES AHORA PREMIUM `);
        }
      }
      else{
        return res.send("USUARIO NO ENCONTRADO");
      }
    }
    
    else{
      return res.send("ID INVÁLIDA");
    }

  }
  catch(e){
    console.log(e);
    throw e;
  }
});

usersRouter.get("/:uid", async (req, res) => {
 UController.getById(req,res);
});

usersRouter.delete("/:uid", async (req,res)=>{
 UController.delete(req,res);
});

usersRouter.post("/", async (req, res) => {
  UController.create(req,res)
});

usersRouter.put("/:uid", async (req, res) => {
  UController.update(req,res);
});


usersRouter.post('/:uid/documents', uploader.single('file'), async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await UserMongoose.findOne({_id:uid});
    const file = req.file;

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    let documents=user.documents;
    console.log("DOCUMENTS:",documents);
    const hasIdentification = documents.some((doc) => doc.name === "Identification");
    const hasAddress = documents.some((doc) => doc.name === "Address");
    const hasAccountStatus = documents.some((doc) => doc.name === "Account Status");
    const hasProfileImg = documents.some((doc) => doc.name === "Profile Image");

    console.log("---> Has Identification:", hasIdentification);
    console.log("---> Has Address:", hasAddress);
    console.log("---> Has Account Status:", hasAccountStatus);
    console.log("---> Has Profile Image:", hasProfileImg);

    if(req.body.fileType=="profile"){
      if(!hasProfileImg){
        const newDocument = {
          name: 'Profile Image',
          reference: `/uploads/profiles/${file.filename}`, // Ruta al archivo subido
        };
        documents.push(newDocument);
      } 
    }
    else if(req.body.fileType=="product"){
      const newProduct = {
        name: 'Product Image',
        reference: `/uploads/products/${file.filename}`, // Ruta al archivo subido
      };
      documents.push(newProduct);
    }
    else if(req.body.fileType=="document"){
      if(req.body.documentType=="identification"){
        if(!hasIdentification){
          const newDocument = {
            name: 'Identification',
            reference: `/uploads/documents/${file.filename}`,
          };
          documents.push(newDocument);
        }
      }
      else if(req.body.documentType=="address"){
        if(!hasAddress){
          const newDocument = {
            name: 'Address',
            reference: `/uploads/documents/${file.filename}`,
          };
          documents.push(newDocument);
        }
      }
      else if(req.body.documentType=="accountStatus"){
        if(!hasAccountStatus){
          const newDocument = {
            name: 'Account Status',
            reference: `/uploads/documents/${file.filename}`,
          };
          documents.push(newDocument);
        }
      }
    }
    const updateUser= await UserMongoose.updateOne({_id:uid},{documents});
    return res.status(200).json({ message: 'Documento subido exitosamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir documento' });
  }
});
