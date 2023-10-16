socket=io();

///AUMENTAR CANTIDAD DE PRODUCTO
function increaseProductQuantity(cid, pid) {
  try {
    socket.emit("increaseProductQuantity", { cid, pid });
    // Modificar la cantidad en el HTML
    const quantityElement = document.querySelector(`.quant${pid}`);
    const newQuantity = parseInt(quantityElement.textContent) + 1;
    quantityElement.textContent = newQuantity;

  } catch (error) {
    alert("Error:", error);
  }
};

///DISMINUIR CANTIDAD DE PRODUCTO
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
    alert("Error:", error);
  }
}

/////MODIFICAR RESULTADO AL RECIBIR RESPUESTA DEL SERVIDOR
socket.on("cartUpdated",(msg)=>{
  document.querySelector(".totalAmount").innerText=msg.newTotal;
});

////BOTON COMPRAR
let buy_button=document.querySelector(".buy_button");
buy_button.addEventListener("click", async (e) => {
    e.preventDefault();
    const amount = document.querySelector(".totalAmount").innerText;
    const purchaser = user.email;
    if (amount == 0) {
      alert("El carrito está vacío");
    } else {
      const API_URL = "/api";
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
  
        if (!data.stockInfo.valid) {
          alert("Stock insuficiente");
        } else {
          alert("Válido");
          window.location.href= window.location.origin + '/views/misc/payment-intent';

        }
      } catch (error) {
        alert("Error:", error);
      }
    }
  });
