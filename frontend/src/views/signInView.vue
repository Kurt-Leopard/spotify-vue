<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { API_URL } from '@/api';

const router=useRouter();

const email = ref();
const password = ref();

const send = () => {
  const data = {
    email: email.value,
    password: password.value
  };
  axios.post(`${API_URL}login`, data).then((response) => {
    if (response.data.success) {
      console.log(response.data.token);
      sessionStorage.setItem('token', response.data.token);
      location.reload();
    } else {
      console.log(response.data.error);
    }

  });


}
const closeLogin=ref(false);
const back=()=>{
  closeLogin.value=true;
  setTimeout(()=>{
    router.push({path:'/'});
    closeLogin.value=false;
  },200);
 
}
</script>
<template>
  <div class="flex w-full min-h-full flex-1 flex-col justify-center px-4 py-10 lg:px-8 fixed top-0 bg-white animate-slide-in-login" :class="{ 'animate-slide-out-login':closeLogin}">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <svg  @click="back" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-9 h-9 border p-2 rounded-lg">
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      <h2 class="mt-4  text-3xl leading-9 tracking-tight text-gray-700 outfit-header"></h2>
    </div>

    <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="send">
        <div>
          <div class="mt-2">
            <input id="email" name="email" v-model="email" type="email" autocomplete="email" required
              class="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 outfit-subtext"
              placeholder="Username" />
          </div>
        </div>

        <div>
          <div class="mt-2">
            <input id="password" name="password" v-model="password" type="password" autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500  outfit-subtext"
              placeholder="Password" />
          </div>
          <div class="flex items-center justify-start">

            <div class="mt-4">
              <RouterLink to="/forgotPassword" class=" text-indigo-600  hover:text-indigo-500 font-bold  outfit-subtext">
                Forgot password?</RouterLink>
            </div>
          </div>
        </div>
        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 p-4 outfit-font font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
        </div>
      </form>

      <p class="mt-10 text-center text-gray-500 outfit-subtext">
        Don't have an account?
        {{ ' ' }}
        <RouterLink to="/signUp" class=" text-indigo-600 hover:text-indigo-500 font-bold">Sign Up</RouterLink>
      </p>
    </div>
  </div>
</template>
<style scoped>
/* bottom to top */

@keyframes slide-in-login {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slide-out-login {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}

.animate-slide-in-login {
  animation: slide-in-login 0.5s forwards;
}

.animate-slide-out-login {
  animation: slide-out-login 0.5s forwards;
}
</style>
