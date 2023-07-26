const addProduct=(cid,pid)=>{
    socket.emit("add_to_cart",{
        product:pid,
        cart:cid
    });
};

const getPagProducts=()=>{
    socket.emit("getPagProducts");
}

let carritoId= localStorage.getItem("carritoId");

const get_cart=()=>{

    if(carritoId=="undefined"|| carritoId==null){

        const url="http://localhost:8080/api/sessions/current";

        const options={
            method: "GET",
            headers:{
                "Content-Type":"application/json",
            }
        };

        fetch(url,options)
            .then((response)=>response.json())
            .then((data)=>{
                console.log('RESPONSE', data);
                localStorage.setItem("carritoId",data.cart);
                carritoId=data.cart;
            })
            .catch((error)=>{
                console.error("Error:",error);
            })
        
    }
    else{
        console.log(carritoId);
    }

}
get_cart();

function putIntoCart(_id){
    if(carritoId!="undefined" && carritoId!=null){
    console.log("cart:",carritoId,"product:",_id);
    const API_URL="http://localhost:8080/api";
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

