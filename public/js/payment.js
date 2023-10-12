const API_URL=window.location.origin;
///PARTE DEL CÓDIGO FUE OBTENIDO DE LA DOCUMENTACIÓN DE STRIPE

const stripe = Stripe("pk_test_51NzLL2De7DytpuXRISV3eCm7UH9OZXweR0xwxGE5sZ0Xfwu8T2XqUxwgf3YW4sY5uYcIwf17Pbikj8DzgO1VEKOw00U87q3Cj0");
let elements;

initialize();
checkStatus();

document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

let emailAddress = '';
// Fetches a payment intent and captures the client secret
async function initialize() {
  let clientSecret;
  let url= API_URL + '/api/payments/intent';
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    
  })
  .then((response)=>response.json())
  .then((data)=>{
    clientSecret=data.payload.client_secret;
  })
  .catch((error)=>{
      console.log("Error:", error);
      alert(JSON.stringify(error));
  })

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
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  let returnUrl=API_URL+'/views/misc/paymentCompleted';
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      //payment completion page
      return_url: returnUrl,  
      receipt_email: emailAddress,
    },
  });

  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

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

let showPayment=document.querySelector('.payment-show');

