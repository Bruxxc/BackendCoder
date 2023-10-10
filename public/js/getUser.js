//////CURRENT SESSION///////////

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
    
    if(user.user){
        console.log(user);
    }

}
  
checkUser();

/////////////////////////////////////