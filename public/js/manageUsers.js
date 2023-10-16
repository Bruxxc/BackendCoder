///MANAGER DE USUARIOS (ADMIN)
const API_URL=window.location.origin;
///CAMBIAR ROL DE USUARIO
function changeRole(_id,role){
    const url = API_URL + "/api/users/" + _id;
    const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: role }),
      };

    fetch(url,options)
    .then((response)=>response.json())
    .then((data)=>{
        let roleDisplay=document.querySelector(`.role_${_id}`);
        roleDisplay.innerText=role;
        alert("User updated");
        
    })
    .catch((error)=>{
      alert(JSON.stringify(error));
    });
}

///ELIMINAR USUARIO
function deleteUser(_id){
    const url = API_URL + "/api/users/" + _id;
    const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
    };
    
    fetch(url,options)
    .then((response)=>response.json())
    .then((data)=>{
        let userDisplay=document.querySelector(`.user-container_${_id}`);
        userDisplay.remove();
        alert("User deleted");
        
    })
    .catch((error)=>{
      alert(JSON.stringify(error));
    });

}