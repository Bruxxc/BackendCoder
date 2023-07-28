import { UserService } from "../services/User.service.js";

const UService= new UserService;

export class UsersController{
    async getAll(req,res){
        try {
            const users = await UService.getAll();
            return res.status(200).json({
              status: "success",
              msg: "users list",
              data: users,
            });
          } catch (e) {
            return res.status(500).json({
              status: "error",
              msg: e,
              data: {},
            });
          }
    };
    
    async getById(req,res){
        try {
            const uid = req.params.uid;
            const user = await UService.getById(uid);
            if (user) {
              return res.status(200).json({
                status: "success",
                msg: "user found",
                data: user,
              });
            }
            else{
                return res.status(201).json({
                  status: "error",
                  msg: "user not found",
                  data:{}
                });
             }
          } catch (e) {
            return res.status(500).json({
              status: "Error",
              msg: e,
              data:{}
            });
          }
    };

    async delete(req,res){
        const id=req.params.uid;
        try{
        const user = await UService.getById(id);
        console.log(user);
        if(user){
            const userDeleted = await UService.delete(id);
            return res.status(201).json({
            status: "success",
            msg: "user deleted",
            data: user,
            info:userDeleted
            });
        }
    
        else{
            return res.status(200).json({
            status: "error",
            msg: "user not found",
            });
    
        }
        } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
        }
    };

    async create(req,res){
        try {
            const {firstName, lastName,age, userName, email, password,role,cart} = req.body;
            const userCreated = await UService.create(firstName, lastName,age, userName, email, password,role,cart);
            return res.status(201).json({
              status: "succes",
              msg: "user created.",
              data: { userCreated },
            });
          } catch (e) {
            console.log(e);
            return res.status(500).json({
              status: "error.",
              msg: "something went wrong :(",
              data: {},
          });
        }
    };

    async update(req,res){
        try {
            const id = req.params.uid;
            const {firstName, lastName, userName, email, password} = req.body;
            const userUpdated = await UService.update(id ,{firstName, lastName, userName, email, password});
        
            return res.status(201).json({
              status: "success",
              msg: "user updated",
              data: {userUpdated},
            });
          } catch (e) {
            return res.status(500).json({
              status: "error",
              msg: "something went wrong :(",
              data: {},
            });
          }
    };


}