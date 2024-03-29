const socket=io();

/////SET CHAT
const setChat= ()=>{
    socket.emit("set_chat");
}

///SETEAR CHAT FUNCIÓN
socket.on("set_chat_res",(msgs)=>{
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

///MANDAR MENSAJE
const send_msg=()=>{
  
  if(user.user){
    if(user.role=="user"){
      let msg=send_msg_input.value;
      if(msg.length > 0){
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

///BOTÓN MANDAR MENSAJE
send_msg_btn.addEventListener("click",(event)=>{
    event.preventDefault();
    send_msg();
});

///SETEAR CHAT
setChat();