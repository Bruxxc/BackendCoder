import { createHash } from "../utils/bcrypt.js";
import { MDBCartManager } from "../dao/helpers/MDBManagers/MDBCartManager.js";
const CManager= new MDBCartManager;

export class UserDTO_INPUT {
    constructor(firstName,lastName,age,userName,email,password,role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age ? age : "---";
        this.userName = userName;
        this.email = email;
        this.password = createHash(password);
        this.role = role;
        
    }

    async initCart(){
        const createCart = await CManager.createCart();
        this.cart= createCart._id;
    }
};