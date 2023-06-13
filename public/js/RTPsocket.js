const socket=io();



//GET PRODUCTS
const setProducts= ()=>{
  socket.emit("set_products");
}

socket.on("set_products_res",(products)=>{
  console.log("recibido set");
  const prodList=document.querySelector(".prod_list");
  prodList.innerHTML="";
  products.products.forEach((product) => {
    const listItem = document.createElement("div");
    listItem.classList.add("prod_card");
    
    const pId=document.createElement("p");
    pId.innerText=`${product._id}`;
    pId.classList.add("prod_id");

    const pImg=document.createElement("img");
    pImg.src="../../static/example.jpg";
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
    id:id
  });
  console.log("enviado",id);
})


socket.on("delete_res",(res)=>{
  if(res.res){
    setProducts();
    alert("Producto eliminado");
   
  }

  else{
    alert("Producto NO encontrado");
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
    stock:stock
  });


});

socket.on("add_res",(res)=>{
    setProducts();
    alert("Producto añadido");
});

socket.on("add_error",(res)=>{
  alert("Producto NO añadido");
  if(res.res==1){
    alert("Por favor completa todos los campos requeridos");
  }
  ;
})

setProducts();