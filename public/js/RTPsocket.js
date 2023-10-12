const API_URL=window.location.origin;
const socket=io();
let email,role;



//GET OWNER PRODUCTS
const setOwnerProducts= (owner)=>{
  socket.emit("set_owner_products",{owner:owner});
}

socket.on("set_owner_products_res",(products)=>{
  const prodList=document.querySelector(".prod_list");
  prodList.innerHTML="";
  products.products.forEach((product) => {
    const listItem = document.createElement("div");
    listItem.classList.add("prod_card");
    
    const pId=document.createElement("p");
    pId.innerText=`${product._id}`;
    pId.classList.add("prod_id");

    const pImg=document.createElement("img");
    pImg.src="../../static/img/example.jpg";
    pImg.classList.add("example_image");

    const pTitle=document.createElement("h3");
    pTitle.innerText=`${product.title}`;
    pTitle.classList.add("prod_title");

    const pPrice=document.createElement("h5");
    pPrice.innerText=`${product.price}`;
    pPrice.classList.add("prod_price");

    listItem.appendChild(pId);
    listItem.appendChild(pImg);
    listItem.appendChild(pTitle);
    listItem.appendChild(pPrice);

    prodList.appendChild(listItem);
  });
  console.log(products);
});

//DELETE PRODUCT
const deleteProductButton=document.querySelector(".delete_btn");

deleteProductButton.addEventListener("click",(event)=>{
  event.preventDefault();
  const pid=document.querySelector(".pid");
  const id=pid.value;
  socket.emit("delete_product",{
    id:id,
    owner:email
  });
  console.log("enviado",id);
})


socket.on("delete_res",(res)=>{
  if(res.res==1){
    setOwnerProducts(email);
    alert("Producto eliminado");
   
  }

  else if(res.res==2){
    alert("NO tienes permisos para eliminar ese producto");
  }

  else if(res.res==3){
    alert("ID inválida");
  }


  else if (res.res==0){
    alert("Producto NO encontrado");
  }

  else{
    alert("NO tiene permiso para eliminar ese producto");
  }
});


//ADD PRODUCT

const addProductButton=document.querySelector('.add_btn');

addProductButton.addEventListener('click',(event)=>{
  event.preventDefault();
  const title=document.querySelector(".add_title").value;
  const description= document.querySelector(".add_description").value;
  const category= document.querySelector(".add_category").value;
  const price= document.querySelector(".add_price").value;
  const thumbnail= document.querySelector(".add_thumbnail").value;
  const code= document.querySelector(".add_code").value;
  const stock= document.querySelector(".add_stock").value;
  console.log(title,description,price,thumbnail,code,stock);

  socket.emit("add_product",{
    title:title,
    description:description,
    category:category,
    price:price,
    thumbnail:thumbnail,
    code:code,
    owner:email,
    stock:stock
  });


});

socket.on("add_res",(res)=>{
    setOwnerProducts(email);
    alert("Producto añadido");
});

socket.on("add_error",(res)=>{
  alert("Producto NO añadido");
  if(res.res==1){
    alert("Por favor completa todos los campos requeridos");
  }
  ;
})


////GET USER

const getCurrentUserInfo= async ()=>{

  var requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
  };
  let url=API_URL+'/api/sessions/current';
  fetch(url, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.user==null){
              alert("Not logged in");
              window.location.href = "/views/sessions/login";
            }

            else if(data.role=="user"){
              alert("Funcion exclusiva para usuarios premium");
              window.location.href = "/views/products";
            }

            else{
              email=data.email;
              user=data.user;
              role=data.role;
              setOwnerProducts(email);
            }
              
          })
          .catch(error => console.error(error));
}

getCurrentUserInfo();