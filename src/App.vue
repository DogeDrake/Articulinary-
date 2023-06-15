<template>
  <header v-if="showHeader" class="app-header">
    <div @click="goToUserList">
      <img class="logo" src="./assets/Logo2.png" alt="Logo de la aplicación">
    </div>
    <nav>
      <ul>
        <li><a href="/home"><i class="fas fa-home"></i><span>Home</span></a></li>
        <li><a href="/buscar"><i class="fas fa-search"></i><span>Buscar</span></a></li>
        <li><a href="/favoritos"><i class="fas fa-heart"></i><span>Favoritos</span></a></li>
      </ul>
    </nav>
    <div class="user-actions">
      <a href="/nuevo" class="btn-primary"><i class="fas fa-plus"></i><span>Añadir Recetas</span></a>
      <a href="/usuario">
        <div class="profile-img">
          <i class="fas fa-user"></i>
        </div>
        <span>Usuario</span>
      </a>
    </div>
  </header>

  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    showHeader() {
      return this.$route.path !== '/login' && this.$route.path !== '/register';
    }
  },
  methods: {
    goToUserList() {
      this.$router.push('/home');
    }
  }
}
</script>

<style>
.custom-link {
  text-decoration: none;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #212529;
  color: white;
}

.app-header .logo img {
  width: 100px;
}

.app-header nav ul {
  display: flex;
  gap: 20px;
}

.app-header nav li {
  list-style: none;
}

.app-header nav a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  border-radius: 20px;
  padding: 15px 25px;
}

.app-header nav a:hover {
  background-color: salmon;
}

.app-header nav a i {
  font-size: 20px;
  margin-right: 10px;
}

.app-header nav a span {
  margin-left: 10px;
}

.app-header .user-actions a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  border-radius: 20px;
  padding: 15px 25px;
  gap: 10px;
}

.app-header .user-actions a:hover {
  background-color: salmon;
}

.app-header .user-actions a.btn-primary {
  background-color: #b49874;
}

.app-header .user-actions a i {
  font-size: 20px;
}

.app-header .user-actions a span {
  margin-left: 10px;
}

.app-header .user-actions img.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.logo {
  width: 90px;
  height: 90px;
  cursor: pointer;
}
</style>