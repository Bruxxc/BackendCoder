import { UserModel } from "../Mongoose/users.mongoose";

export class UserModel{

    async getAll(){
        try{
            const users=await UserModel.find({})
            return users;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getByEmail(email){
        try{

            const user= await UserModel.findOne({"email":email});

            if(user[0]){
                return user[0];
            }

            else return undefined;
            
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async create(firstName, lastName,age, userName, email, password,role,cart){
        try{
            const newUser = {
                email: email,
                firstName: firstName,
                lastName:lastName,
                userName: userName,
                age:age,
                role: role,
                password: password,
                cart: cart
            };
            
            let userCreated = await UserModel.create(newUser);
            return userCreated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async update(id,info){
        try{
            const userUpdated = await UserModel.updateOne(
                { _id: id },
                {info}
            );
            return userUpdated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async delete(id){
        try{
            const userDeleted = await UserModel.deleteOne({id:id});
            return userDeleted;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

}