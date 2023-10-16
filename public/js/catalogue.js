///SETEAR TODOS LOS PRODUCTOS EN LA PÁGINA
const getPagProducts=()=>{
    socket.emit("getPagProducts");
}

///AGREGAR PRODUCTO AL CARRITO
function putIntoCart(_id){
    if(user.user){
        if(user.role=="user"){
            const API_URL=window.location.origin + `/api`;
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
                    alert("Error:", error);
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

///
let cart_button=document.querySelector(".dropdown");
cart_button.addEventListener("click",(e)=>{
    e.preventDefault();
    if(user.user){
        window.location.href = `/views/carts/${user.cart}`;
    }
    else{
        alert("Not logged in");
        window.location.href = "/views/sessions/login";
    }
});