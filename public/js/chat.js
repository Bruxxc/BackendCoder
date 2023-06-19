const socket=io();

let user = "";

async function userValidation() {
    const { value: userName } = await Swal.fire({
      title: "Enter your username",
      input: "text",
      inputLabel: "Your username",
      inputValue: "",
      showCancelButton: false,
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
  
    user = userName;
}
userValidation();


//SET CHAT
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
    let msg=send_msg_input.value;
    if(msg.length > 0){
        console.log(msg);
        socket.emit("msg_front_to_back", {
            text: msg,
            userName: user,
          });
    }
    send_msg_input.value="";
}

send_msg_btn.addEventListener("click",(event)=>{
    event.preventDefault();
    send_msg();
});



setChat();