const API_URL=window.location.origin;
///parte del código fue obtenido de la documentación de Stripe

const stripe = Stripe("pk_test_51NzLL2De7DytpuXRISV3eCm7UH9OZXweR0xwxGE5sZ0Xfwu8T2XqUxwgf3YW4sY5uYcIwf17Pbikj8DzgO1VEKOw00U87q3Cj0");
let elements;
let emailAddress = '';
let dataCart;
////---->CREAR UN PAYMENT INTENT<-----
async function initialize() {
  const url= API_URL + '/api/payments/intent';///url para crear payment intent
  const url2 = API_URL + `/api/carts/${user.cart}/purchase`;///url para chequear validez de compra
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const checkCart = await fetch(url2, options);
  dataCart= await checkCart.json();
  ///si la compra es inválida...
  if(dataCart.status=='error'){
    window.location.href=API_URL+'/views/products';
  }


  ///si la compra es válida (stock válido)...
  else{
    let clientSecret;
    const options2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 'amount': dataCart.amount })
    };
    const createIntent = await fetch(url,options2)
    .then((response)=>response.json())
    .then((data)=>{
        clientSecret=data.payload.client_secret;
        const appearance = {
          theme: 'stripe',
        };
        elements = stripe.elements({ appearance, clientSecret });
    
        const linkAuthenticationElement = elements.create("linkAuthentication");
        linkAuthenticationElement.mount("#link-authentication-element");
    
        linkAuthenticationElement.on('change', (event) => {
          emailAddress = event.value.email;
        });
    
        const paymentElementOptions = {
          layout: "tabs",
        };
    
        const paymentElement = elements.create("payment", paymentElementOptions);
        paymentElement.mount("#payment-element");
    })
    .catch((e)=>{
        alert('error',e);
    })

    
  }
}
//----------------------------

////---->CHEQUEAR UN PAYMENT INTENT CREADO<-----
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
  console.log(paymentIntent);
  

}
//----------------------------

////---->PROCESAR COMPRA<-----
async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);///procesar compra

  let returnUrl=API_URL+'/views/misc/paymentCompleted';

  const error = await stripe.confirmPayment({
    elements,
    redirect: "if_required",
    confirmParams: {
      //payment completion page
      return_url: returnUrl,  
      receipt_email: emailAddress,
    },
  }).then(async function (result){
    
    if(result.paymentIntent){
      alert('Pago procesado con éxito');
      const ticketURL= API_URL + `/api/tickets/final-ticket`;
      let productList= JSON.stringify(dataCart.stockInfo.products);

          const ticketOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: dataCart.amount,
              purchaser: user.email,
              products: productList,
              cart:user.cart

            }),
          };

          try {
            const createTicket = await fetch(ticketURL, ticketOptions)
            .then(response => response.json())
            .then(data=>{
              console.log('TICKET',data);
                if (data.status=='Success') {
                  alert('Compra realizada con éxito');
                  window.location.href= API_URL+ `/views/misc/ticket/${data.data._id}`
                    
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

    else if(result.error){
      alert('ERROR', result.error.message);
    }


  });
  setLoading(false);///dejar de procesar compra
}
//----------------------------





// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

document.querySelector("#payment-form").addEventListener("submit", handleSubmit);




////---->INICIALIZAR PAGO<-----
async function initPayment(){
  try{
  let initUser= await checkUser();/////espera a obtener el usuario
  let initPaymentIntent= await initialize();/////crea un payment intent
  let initCheckStatus= await checkStatus();/////chequea el payment intent creado
  }
  catch(e){
    console.log(e);
  }
}

initPayment();