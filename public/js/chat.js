const socket=io();
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
  
  if(!user.user){
    alert("Not logged in");
  }
  else{
    console.log(user);
  }
}

checkUser();

/////SET CHAT
const setChat= ()=>{
    socket.emit("set_chat");
}

//

socket.on("set_chat_res",(msgs)=>{
    console.log("recibido set chat");
    console.log(msgs.msgs);


    const chat=document.querySelector(".chat_msg_list");
    chat.innerHTML="";
    
    msgs.msgs.forEach(msg => {
        const msgContainer= document.createElement("div");
        msgContainer.classList.add("msg_container");

        const msgUser= document.createElement("h5");
        msgUser.classList.add("msg_user");
        msgUser.innerText=msg.userName;

        const msgText=document.createElement("p");
        msgText.classList.add("msg_text");
        msgText.innerText=msg.text;

        msgContainer.appendChild(msgUser);
        msgContainer.appendChild(msgText);
        chat.appendChild(msgContainer);
    });

  });

const send_msg_btn= document.querySelector(".send_msg_btn");
const send_msg_input= document.querySelector(".send_msg_input");

const send_msg=()=>{
  
  if(user.user){
    if(user.role=="user"){
      let msg=send_msg_input.value;
      if(msg.length > 0){
          console.log(msg);
          socket.emit("msg_front_to_back", {
              text: msg,
              userName: user.user,
            });
      }
      send_msg_input.value="";
    }

    else{
      alert("Only users can write in the chat");
    }

  }

  else{
    alert("You must be logged in to use the chat");
  }



}

send_msg_btn.addEventListener("click",(event)=>{
    event.preventDefault();
    send_msg();
});



setChat();