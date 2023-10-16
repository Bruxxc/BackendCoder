//////CURRENT SESSION///////////
let user= undefined;
///OBTENER USUARIO ACTUAL
async function getCurrentUser() {
    try {
      const response = await fetch('/api/sessions/current');
      const userData = await response.json();
    
      return userData;
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      return null;
    }
}


async function checkUser(){
    user= await getCurrentUser();
}

/////////////////////////////////////

checkUser();