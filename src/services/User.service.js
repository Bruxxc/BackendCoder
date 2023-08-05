import { UsersModel } from "../dao/models/Mongo/users.model.js";
const UModel= new UsersModel;

export class UserService{
    async getAll(){
        try{
           const users = await UModel.getAll();
           return users;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    async getByEmail(email){
        try{
            const user= await UModel.getByEmail(email);
            return user;            
        }

        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getByUsername(username){
        try{
            const user= await UModel.getByUsername(username);
            return user;            
        }

        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getById(id){
        try{
            const user= await UModel.getById(id);
            return user;            
        }

        catch(e){
            console.log(e);
            throw e;
        }
    };

    async create(user){
        try{
            const userCreated = await UModel.create(user);
            return userCreated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async update(id,info){
        try{
            const userUpdated = await UModel.update(id,info);
            return userUpdated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async delete(id){
        try{
            const userDeleted = await UModel.delete(id);
            return userDeleted;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }
}