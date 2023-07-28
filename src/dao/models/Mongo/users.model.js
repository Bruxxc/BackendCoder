import { UserMongoose } from "../Mongoose/users.mongoose.js";

export class UsersModel{

    async getAll(){
        try{
            const users=await UserMongoose.find({})
            return users;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getByEmail(email){
        try{

            const user= await UserMongoose.find({"email":email});

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

    async getByUsername(username){
        try{

            const user= await UserMongoose.find({"userName":username});

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

    async getById(id){
        try{

            const user= await UserMongoose.find({"_id":id});

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
            
            let userCreated = await UserMongoose.create(newUser);
            return userCreated;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async update(id,info){
        try{
            const userUpdated = await UserMongoose.updateOne(
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
            const userDeleted = await UserMongoose.deleteOne({"_id":id});
            return userDeleted;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

}