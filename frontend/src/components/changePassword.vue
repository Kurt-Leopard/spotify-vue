<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { API_URL } from '@/api';
import { useAuthStore } from '@/stores/store';
import { decodeJWT } from '@/stores/jwt';

const store=useAuthStore();

const router = useRouter();

const email = ref();
const password = ref();
const emailToverify = ref();
const newPass = ref(false);
const saveTochange = ref(false);

const sendingEmail = ref('Send')
const msgError = ref(null)
const send = () => {
  sendingEmail.value = 'Sending';
  const data = {
    email: email.value,
  };
  axios.post(`${API_URL}password`, data).then((response) => {
    if (response.data.success) {
      emailToverify.value = response.data.msg;
      newPass.value = true;
      sendingEmail.value = 'Send';
    } else {
      msgError.value = response.data.error;
      sendingEmail.value = 'Send';
      setTimeout(() => {
        msgError.value = null;
      }, 2000);
    }

  });


}
const closeLogin = ref(false);
const back = () => {
  closeLogin.value = true;
  setTimeout(() => {
    router.push({ path: '/' });
    closeLogin.value = false;
  }, 200);

}

const number = ref();
const codeError=ref();
const code = () => {
  const data = {
    code: number.value,
  };
  axios.post(`${API_URL}code`, data).then((response) => {
    if (response.data.success) {
      newPass.value = false;
      saveTochange.value = true;
    } else {
      codeError.value=response.data.error;
      setTimeout(() => {
        codeError.value = null;
      }, 2000);
    }

  });

}
let save = ref('Save');
const ValidationError = ref();
const toast = ref(false);
const Save = () => {
  save.value = 'Sending';
  let userId;
  if(store.token!=null){
    const decodedToken= decodeJWT(store.token);
    userId=decodedToken.userId;
  }
  const data = {
    password: password.value,
  };
  axios.put(`${API_URL}newPassword/${userId}`, data).then((response) => {
    if (response.data.success) {
      console.log(response.data.msg);
      setTimeout(() => {
        save.value = 'Save';
        toast.value = true;
        setTimeout(() => {
          toast.value = false;
          router.push({path:'/views/home'})
        }, 2000);
      }, 2000)
    } else {
      save.value = 'Save';
     ValidationError.value=response.data.errors[0].msg;
      setTimeout(() => {
        ValidationError.value = null;
      }, 2000);
    }
  });
}

</script>
<template>

  <div
    class="flex w-full min-h-full flex-1 flex-col justify-center px-4 py-10 lg:px-8 fixed top-0 bg-white animate-slide-in-login"
    :class="{ 'animate-slide-out-login': closeLogin }">
    <div class="toast-container mt-4 w-full left-4 lg:left-32 xl:left-23 top-0 fixed overflow-hidden  z-20 ">
      <div v-show="toast" class="toast-content" :class="{ 'animate-slide-in': toast }">
        <div class="bg-white p-4 w-72 rounded-md border flex items-center">
          <i class="fas fa-check-circle text-green-500 mx-2"></i>
          <p class="text-gray-800 mx-4">Your action was completed successfully!</p>
        </div>
      </div>
    </div>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <p @click="back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-9 h-9 border p-2 rounded-lg">
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      </p>
      <h2 class="mt-4  text-3xl leading-9 tracking-tight text-gray-700 outfit-header">{{ !emailToverify ? 'Enter your email to facilitate the password change process.': newPass ? 'Please enter the verification code.': 'Enter new Password' }}</h2>
    </div>

    <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="send" v-show="!emailToverify">
        <div>
          <div class="mt-2">
            <input id="email" name="email" v-model="email" type="email" autocomplete="email" required
              class="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 outfit-subtext"
              placeholder="Username" />
          </div>
          <small v-show="msgError" class="mx-4 text-red-500 outfit-subtext">{{ msgError }}</small>
        </div>
        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 p-4 outfit-font font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{
              sendingEmail }}</button>
        </div>
      </form>
      <form class="space-y-6" @submit.prevent="code" v-show="newPass">
        {{ emailToverify }}
        <div>
          <div class="mt-2">
            <input id="number" name="number" v-model="number" type="number" autocomplete="number" required
              class="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 outfit-subtext"
              placeholder="Code" />
          </div>
          <small v-show="codeError" class="mx-4 text-red-500 outfit-subtext">{{ codeError }}</small>
        </div>
        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 p-4 outfit-font font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send</button>
        </div>
      </form>
      <form class="space-y-6" @submit.prevent="Save" v-show="saveTochange">
        {{ emailToverify }}
        <div>
          <div class="mt-2">
            <input id="password" name="password" v-model="password" type="password" autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500  outfit-subtext"
              placeholder="Password" />
          </div>
          <small v-show="ValidationError" class="mx-4 text-red-500 outfit-subtext">{{ ValidationError }}</small>
        </div>
        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 p-4 outfit-font font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{ save }}</button>
        </div>
      </form>
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


.toast-container {
  overflow: hidden;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s forwards;
  transform: translateX(-100%);
}
</style>
