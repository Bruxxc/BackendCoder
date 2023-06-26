
const addProduct=(cid,pid)=>{
    socket.emit("add_to_cart",{
        product:pid,
        cart:cid
    });
};


const getPagProducts=()=>{
    socket.emit("getPagProducts");
}


const carritoId=localStorage.getItem("carrito-id");
const API_URL = "http://localhost:8080/api";




if(!carritoId){
    alert("no id");

    const url="http://localhost:8080/api/carts";

    const data={};

    const options={
        method: "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    };

    fetch(url,options)
        .then((response)=>response.json())
        .then((data)=>{
            alert("Response", data.data._id);
            localStorage.setItem("carrito-id",data.data._id);
        })
        .catch((error)=>{
            console.error("Error:",error);
        })


}
else{
    alert(carritoId);
}

function putIntoCart(_id){
    const url = API_URL + "/carts/" + carritoId + "/products/" + _id;

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
        window.location.href = "/views/sessions/logout";
        console.log("logout");
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