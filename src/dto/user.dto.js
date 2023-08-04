export default class UserDTO_OUTPUT {
    constructor(user){
        this.fullName= `${user.firstName} ${user.lastName}`;
        this.firstName=user.firstName;
        this.lastName=user.lastName;
        this.age = user.age ? user.age : "---";
        this.userName= user.userName;
        this.email=user.email;
        this.role=user.role;
        this.cart=user.cart;
        this._id=user._id;
    }
}