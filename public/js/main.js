(function($) {
	"use strict"

	// Mobile Nav toggle
	$('.menu-toggle > a').on('click', function (e) {
		e.preventDefault();
		$('#responsive-nav').toggleClass('active');
	})

	})(jQuery);

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

let cart_button=document.querySelector(".dropdown");

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