const changeButton=document.querySelector(".change_button");
const API_URL="http://localhost:8080/api";
const url = API_URL + "views/sessions/login/changePassword";

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




changeButton.addEventListener("click", async (e)=>{
    e.preventDefault();
    if(checkPasswords()){ 
        let nuevaContraseña=document.getElementById("password").value;
        let token=document.getElementById("token").value;
        let email=document.getElementById("email").value;
        var data = { new_Password: nuevaContraseña,token:token,email:email };

        var requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            redirect: "follow"
        };

        fetch("http://localhost:8080/views/sessions/login/changePassword", requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert(data.msg);
                    if(data.redir){
                        window.location.href = "/views/sessions/login";
                    }
                })
                .catch(error => console.error(error));
    };
})
