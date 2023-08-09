socket=io();

///////CURRENT SESSION///////////
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



//////////IPQ
function increaseProductQuantity(cid, pid) {
  try {
    socket.emit("increaseProductQuantity", { cid, pid });
    // Modificar la cantidad en el HTML
    const quantityElement = document.querySelector(`.quant${pid}`);
    const newQuantity = parseInt(quantityElement.textContent) + 1;
    quantityElement.textContent = newQuantity;

  } catch (error) {
    console.log("Error:", error);
  }
};

////////DPQ
function decreaseProductQuantity(cid, pid) {
  try {
    socket.emit("decreaseProductQuantity", { cid, pid });
    // Modificar la cantidad en el HTML
    const quantityElement = document.querySelector(`.quant${pid}`);
    const newQuantity = parseInt(quantityElement.textContent) - 1;
    
    // Si la cantidad llega a 0, eliminar el producto
    if (newQuantity === 0) {
      const productElement = document.querySelector(`._${pid}`);
      productElement.parentNode.removeChild(productElement);
    } else {
      quantityElement.textContent = newQuantity;
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

/////AL RECIBIR LA RESPUESTA
socket.on("cartUpdated",(msg)=>{
  document.querySelector(".totalAmount").innerText=msg.newTotal;
});



////BOTON COMPRAR////
let buy_button=document.querySelector(".buy_button");

buy_button.addEventListener("click", async (e) => {
    e.preventDefault();
    const amount = document.querySelector(".totalAmount").innerText;
    const purchaser = user.email;
    console.log("datos de compra:", amount, purchaser);
  
    if (amount == 0) {
      alert("El carrito está vacío");
    } else {
      const API_URL = "http://localhost:8080/api";
      const url = API_URL + `/carts/${user.cart}/purchase`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
  
        if (!data.stockInfo.valid) {
          alert("Error en stock");
          console.log(data.stockInfo.stockError);
        } else {
          alert("Válido");
          const ticketURL= API_URL + `/tickets`;
          let productList= JSON.stringify(data.stockInfo.products);
          console.log(productList);

          const ticketOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: amount,
              purchaser: purchaser,
              products: productList,
            }),
          };
          
          try {
            const createTicket = await fetch(ticketURL, ticketOptions)
            .then(response => {
                if (response.ok) {
                    alert('Compra realizada con éxito');
                    window.location.href = '/views/products';
                } else {
                    alert('Error al realizar la compra');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
          } catch (error) {
            console.log("Error:", error);
          }
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }
  });
