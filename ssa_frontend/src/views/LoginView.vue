<template>
  <div class="login-page">
    <div class="title">
        <h1 class="">SAGASMART</h1>
        <p>Inicia sesión en tu cuenta</p>
    </div>
    <span>o <span style="color: #AAD500; font-weight: bold;">regístrate y empieza a comprar</span></span>
    <div class="login-card">
      <label for="">Correo Electronico</label>
      <input type="text"  placeholder="Ingresa tu Email">
      <label for="">Contraseña</label>
      <input type="password" placeholder="Tu Contraseña">
      
      <router-link to="/about" class="forgot-password">¿Olvidaste tu contraseña?</router-link>
      
      <button class="btnIniciar">Iniciar Sesión</button>
      
      <div class="links">
        <router-link to="/registro">¿No tienes una cuenta?</router-link>
      </div>

      <button class="btnRegistro">Regístrarse</button>
    </div>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Holtwood+One+SC&display=swap');

.title {
    font-weight: bold;
    color: black;
}

.title h1{
    font-family: "Holtwood One SC", serif;
    font-size: 45px;
    margin: 0;
}

.title p{
    font-size: 34px;
    margin: 0;
}

.login-page span {
    font-size: 20px;
    margin-top: 10px;
}

.forgot-password{
  display: block;
  width: 100%;
  margin-top: 10px;
  text-align: left;
  text-decoration: none;
  font-weight: bold;
  color: #2F99DC;
}


.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F9FAFB;
}
.login-card {
  padding: 40px;
  margin: 20px auto 0 auto;
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  text-align: left;
}

.login-card label {
    text-align: left;
    font-weight: bold;
    display: block;
}

input {
    border: 2px #7E7E7E solid;
}

input, button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  box-sizing: border-box;
}

button {
    margin-top: 20px;
    margin-bottom: 20px;
}

.btnIniciar {
  background-color: #AAD500;
  color: white;
  font-weight: bold;
  padding: 15px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btnRegistro {
    background-color: #F0F3F4;
    color: black;
    font-weight: bold;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 15px;
}

.links a {
  color: #7E7E7E;
  text-decoration: none;
  text-align: center;
}

.links {
  text-align: center;
  margin-top: 10px;
}
</style>
