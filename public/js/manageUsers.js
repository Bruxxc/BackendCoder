function changeRole(_id,role){
    const API_URL="http://localhost:8080/api";
    const url = API_URL + "/users/" + _id;
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
        console.log(data);
        let roleDisplay=document.querySelector(`.role_${_id}`);
        roleDisplay.innerText=role;
        alert("User updated");
        
    })
    .catch((error)=>{
      console.log("Error:", error);
      alert(JSON.stringify(error));
    });
}

function deleteUser(_id){
    const API_URL="http://localhost:8080/api";
    const url = API_URL + "/users/" + _id;
    const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
    };
    
    fetch(url,options)
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        let userDisplay=document.querySelector(`.user-container_${_id}`);
        userDisplay.remove();
        alert("User deleted");
        
    })
    .catch((error)=>{
      console.log("Error:", error);
      alert(JSON.stringify(error));
    });

}