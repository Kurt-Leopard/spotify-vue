<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/store';
import { ref, onMounted } from 'vue';
import chatComponent from '@/components/chatComponent.vue';
import { decodeJWT } from '../stores/jwt';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { API_URL } from '@/api';

const router=useRouter();

const store = useAuthStore();

const showMenu = ref(false);
const showMessage = ref(false);


const toggleMenu = () => {
  showMenu.value = !showMenu.value;
}
const slideOut=ref(false);
const cancelMenu = () => {
  slideOut.value=true;
    setTimeout(()=>{
      showMenu.value = !showMenu.value;
      slideOut.value=false;
    },200);
}
// routes
const nonAuthArtist=()=>{
  router.push({path:'/artist'});
  slideOut.value=true;
    setTimeout(()=>{
      showMenu.value = !showMenu.value;
      slideOut.value=false;
    },200);
}
const routeToArtist=()=>{
  router.push({path:'/views/artist'})
  slideOut.value=true;
    setTimeout(()=>{
      showMenu.value = !showMenu.value;
      slideOut.value=false;
    },200);
}
const toggleMessage = () => {
  slideOut.value=true;
  showMessage.value = true;
  setTimeout(()=>{
      showMenu.value = !showMenu.value;
      slideOut.value=false;
    },200);
 
}
const closeChat=ref(false);
const toggleVisibility = () => {
  closeChat.value=true;
  setTimeout(()=>{
    showMessage.value = !showMessage.value;
    closeChat.value=false;
    },200);
};
let userRole = '';
if (store.token != null) {
  const decodedToken = decodeJWT(store.token);
  userRole = decodedToken.role;
}

const userEmail = ref();
const userProfile = ref();
let userId = '';

const fetchData = async () => {

  if (store.token != null) {
    const decodedToken = decodeJWT(store.token);
    userId = decodedToken.userId;
    console.log(userId);
  }
  await axios.get(`${API_URL}user/${userId}`, {
    headers: {
      Authorization: `Bearer ${store.token}`
    }
  }).then((response) => {
    userEmail.value = response.data.data[0].email;
    userProfile.value = response.data.data[0].profile;


  });

}


onMounted(fetchData);
</script>
<template>
  <div>
    <div>
      <header class="w-full px-4 lg:px-32 xl:px-32 py-4 flex justify-between items-center lg:border-b xl:border-b " :class=" store.token? 'border-b':''">
        <div class="w-1/2 flex items-center"><img src="../assets/spotify.png"
            class="w-10 h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full border" alt="">
          <p class="lg:flex xl:flex outfit-header text-indigo-600 text-2xl ml-2">Spotify</p>
        </div>
        <p class="flex justify-end items-center w-full">
          <!-- menu bar -->

          <!-- menu list  -->
        <nav class=" w-full lg:flex lg:justify-end xl:flex xl:justify-end hidden lg:block xl:block">

          <RouterLink to="/">
            <section class="flex items-center">
              <p
                class="mx-2 lg:mx-6 xl:mx-6  flex justify-center items-center font-bold bg-indigo-50 h-10 w-10 rounded-full">
                <i class="fas fa-home text-indigo-600"></i>
              </p>
              <!-- <span class="font-bold">Home</span> -->
            </section>
          </RouterLink>


          <RouterLink :to="userRole ? '/views/artist' : 'artist'">
            <section class="flex items-center">
              <p
                class="mx-2 lg:mx-6 xl:mx-6  flex justify-center items-center font-bold bg-indigo-50 h-10 w-10 rounded-full">
                <i class="fas fa-music text-indigo-600"></i>
              </p>

            </section>
          </RouterLink>
          <span @click="toggleMessage" v-show="userRole">
            <section class="flex items-center">
              <p
                class="mx-2 lg:mx-6 xl:mx-6  flex justify-center items-center font-bold bg-indigo-50 h-10 w-10 rounded-full">
                <i class="fas fa-comment text-indigo-600"></i>
              </p>
              <!-- <span class="font-bold">Chat</span> -->
            </section>
          </span>


          <RouterLink to="/views/manage" v-show="userRole == 'admin'">
            <section class="flex items-center">
              <p
                class="mx-2 lg:mx-6 xl:mx-6  flex justify-center items-center font-bold bg-indigo-50 h-10 w-10 rounded-full">
                <i class="fas fa-user text-indigo-600"></i>
              </p>
              <!-- <span class="font-bold">Manage</span> -->
            </section>
          </RouterLink>
          <RouterLink to="/views/profile" v-if="userProfile">
            <section class="flex items-center">
              <p> <img :src="`/src/assets/uploads/${userProfile}`" class=" rounded-full border   h-10 w-10" alt="">
              </p>
            </section>
          </RouterLink>
        </nav>
        <button @click="showMenu ? cancelMenu() : toggleMenu()"
          class="text-indigo-600 focus:outline-none md:block lg:hidden xl:hidden ml-1">
          <svg v-if="!showMenu" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-1 md:mb-0 lg:mb-0 xl:mb-0" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <input type="search" class=" py-1 px-2 rounded hidden" />
        <!-- menu drop down -->
        </p>
      </header>
      <nav class="toast-container lg:hidden xl:hidden bg-white text-gray-600 fixed h-full w-2/3 top-0 my-auto border-r " style="z-index: 99;"
        v-show="showMenu" :class="{ 'animate-slide-in': showMenu, 'animate-slide-out':slideOut }" >
        <div class="m-1 rounded-lg  flex items-center">
          <p class=" py-2 px-3 rounded-lg "> <img src="../assets/spotify.png" class=" rounded-lg h-12 w-12" alt="">
          </p>
          <RouterLink to="/" class="outfit-header text-indigo-600 text-2xl">Spotify</RouterLink>
        </div>
        <RouterLink to="/views/profile" @click="cancelMenu()" v-if="userProfile">
          <div class="flex items-center border-b">
            <p class=" py-2 px-3 rounded-lg "> <img :src="`/src/assets/uploads/${userProfile}`"
                class=" rounded-full border   mx-1 h-12 w-12" alt="">
            </p>
            <p class="outfit-header text-gray-600 overflow-hidden whitespace-nowrap overflow-ellipsis w-[15ch]">{{ userEmail }}</p>
          </div>
        </RouterLink>

        <RouterLink to="/" @click="cancelMenu()" class="font-bold text-gray-500 outfit-header ">
          <div class="bg-indigo-50 m-2 rounded-lg p-2 flex items-center">
            <p class="bg-indigo-100 py-2 px-3 rounded-lg mr-5"> <i class="fas fa-home text-indigo-600"></i></p>
            Home
          </div>
        </RouterLink>
        <p  @click="store.token ? routeToArtist(): nonAuthArtist()" class="font-bold text-gray-500 outfit-header cursor-pointer">
          <div class="hover:bg-indigo-50 m-2 rounded-lg p-2 flex items-center">
            <p class="bg-indigo-100 py-2 px-3 rounded-lg mr-5"> <i class="fas fa-music text-indigo-600"></i></p>
            PlayList
          </div>
        </p>
        <p class="font-bold text-gray-500 outfit-header cursor-pointer"  @click="toggleMessage" v-show="userRole">
        <div class="hover:bg-indigo-50 m-2 rounded-lg p-2 flex items-center">
          <p class="bg-indigo-100 py-2 px-3 rounded-lg mr-5"> <i class="fas fa-comment text-indigo-600"></i></p>
          Public Chat
        </div>
        </p>
        <RouterLink to="/views/manage" @click="cancelMenu()" class="font-bold text-gray-500 outfit-header ">
          <div class="hover:bg-indigo-50 m-2 rounded-lg p-2 flex items-center">
            <p class="bg-indigo-100 py-2 px-3 rounded-lg mr-5">   <i class="fas fa-user text-indigo-600"></i></p>
          Users Account
          </div>
        </RouterLink>
      </nav>
    </div>
    <chatComponent v-show="showMessage" @toggle-visibility="toggleVisibility" :class="{'animate-slide-in-chat':showMessage, 'animate-slide-out-chat': closeChat} "
      class="lg:w-1/3 xl:w-96 z-20 md:w-1/2 w-full bg-white fixed bottom-0 rounded md:right-10 lx:right-10 lg:right-10">
    </chatComponent>
    <main class="w-full text-white flex justify-center items-center glow-background">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.toast-container {
    overflow: hidden;
    transform: translateX(-100%);
}

@keyframes slide-in {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-out {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
}

.animate-slide-in {
    animation: slide-in 0.5s forwards;
}

.animate-slide-out {
    animation: slide-out 0.5s forwards;
}

/* bottom to top */
@keyframes slide-in-chat {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-out-chat {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100%);
    }
}

.animate-slide-in-chat {
    animation: slide-in-chat 0.5s forwards;
}

.animate-slide-out-chat {
    animation: slide-out-chat 0.5s forwards;
}

</style>
