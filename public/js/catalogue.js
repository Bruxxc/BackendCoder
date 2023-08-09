//////CURRENT SESSION///////////

let user= undefined;

async function getCurrentUser() {
    try {
      const response = await fetch('/api/sessions/current');
      const userData = await response.json();
      console.log("usuario:",userData);
    
      return userData;
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      return null;
    }
}
  
async function checkUser(){
    user= await getCurrentUser();
    
    if(user.user){
        console.log(user);
    }

}
  
checkUser();

/////////////////////////////////////

////////////ADD PRODUCT/////////////

const addProduct=(cid,pid)=>{
    socket.emit("add_to_cart",{
        product:pid,
        cart:cid
    });
};

////////////////////////////////////

const getPagProducts=()=>{
    socket.emit("getPagProducts");
}


function putIntoCart(_id){
    if(user.user){
        if(user.role=="user"){
            console.log("cart:",user.cart,"product:",_id);
            const API_URL="http://localhost:8080/api";
            const url = API_URL + "/carts/" + user.cart + "/products/" + _id;
    
            const options={
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            };
    
            fetch(url,options)
                .then((response)=>response.json())
                .then(()=>{
                    alert("agregado");
                })
                .catch((error)=>{
                    console.log("Error:", error);
                    alert(JSON.stringify(error));
                })
        }
        
        else{
            alert("This function is exclusive for users");
        }
    
    }

    else{
        alert("Not logged in");
    }
}

let login_redir=document.querySelector(".login_redir");

if(login_redir){
    login_redir.addEventListener("click",(e)=>{
        e.preventDefault();
        window.location.href = "/views/sessions/login";
        console.log("login");
    });
}

let logout_redir=document.querySelector(".logout_redir");

if(logout_redir){
    logout_redir.addEventListener("click",(e)=>{
        e.preventDefault();
        console.log("logout");
        localStorage.removeItem("carritoId");
        window.location.href = "/views/sessions/logout";
        
    });
}

let register_redir=document.querySelector(".register_redir");

if(register_redir){
    register_redir.addEventListener("click",(e)=>{
        e.preventDefault();
        window.location.href = "/views/sessions/register";
        console.log("register");
    });
}

let cart_button=document.querySelector(".cart_button");

cart_button.addEventListener("click",(e)=>{
    e.preventDefault();
    console.log("cart");
    if(user.user){
        window.location.href = `/views/carts/${user.cart}`;
    }

    else{
        alert("Not logged in");
        window.location.href = "/views/sessions/login";
    }
    
});