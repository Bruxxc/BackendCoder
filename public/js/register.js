const socket=io();

let register_btn=document.querySelector(".register_btn");

function checkPasswords() {
    let password = document.getElementById("password").value;
    let repeatPassword = document.getElementById("repeat-password").value;
    if (password !== repeatPassword) {
      alert("Las contraseñas no coinciden.");
      return false;
    }

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    return true;
}

function checkEmail() {
    let email = document.getElementById("email").value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("El correo electrónico ingresado no es válido.");
      return false;
    }

    return true;
}

function checkUsername() {
    let username = document.getElementById("username").value;
    if (username.length < 4) {
      alert("El nombre de usuario debe tener al menos 4 caracteres.");
      return false;
    }

    return true;
}

function checkNames(){
    let firstName = document.getElementById("first-name").value;
    let lastName = document.getElementById("last-name").value;
    let age= document.getElementById("age").value;
    if (firstName.length == 0 || lastName.length==0) {
        alert("Ingrese su nombre completo");
        return false;
    }

    else if(!age){
      alert("Ingrese su edad");
      return false;
    }
  
    return true;
}

function validateForm() {
    let isValid = true;

    if(!checkNames()){
      isValid = false;
    }

    if (!checkPasswords()) {
      isValid = false;
    }

    if (!checkEmail()) {
      isValid = false;
    }

    if (!checkUsername()) {
      isValid = false;
    }


    return isValid;
}

register_btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (validateForm()) {
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let firstName = document.getElementById("first-name").value;
    let lastName = document.getElementById("last-name").value;
    let age = document.getElementById("age").value;
    let newUser = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      userName: username,
      password: password,
      age: age
    };

    fetch("/views/sessions/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if(data.status=="error"){
          alert(data.error);
        }
        else if(data.status=="success"){   
          Swal.fire({
            icon: 'success',
            title: 'User created',
          })
          .then(()=>{
            console.log("Registro exitoso:", data);
            window.location.href="/views/sessions/login";
          })      
        }
 
      }
      )
      .catch(error => {
        console.error("Error al registrar:", error);
      });
  }
});

socket.on("userCreated",()=>{
    alert("User created successfully");
    window.location.href = "/views/sessions/login";
});

socket.on("errorCreatingUser",(e)=>{
    alert(e.error);
});
