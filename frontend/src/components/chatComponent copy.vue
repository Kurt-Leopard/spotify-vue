<template>
  <section class="border">
    <div class="w-full flex justify-between items-center border-b px-4">
      <p class="bg-green-500 p-1 rounded-full"></p>
      <p class="outfit-header text-gray-600">Public Chat Group</p>
      <svg @click="toggleVisibility" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 my-2" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>
    <div class="w-full py-6 px-4" style="max-height: 420px; overflow-y: auto; height: 53vh;">
      <ul class="my-2" v-for="(message, index) in messages" :key="index">
        <div v-if="message.username === username">
          <p class="my-2"> <small class="mr-2 text-gray-400">You </small></p>
          <span class=" bg-indigo-600 p-2 text-white my-2 rounded-lg"> {{ message.text }}</span>
        </div>
        <div v-else class="text-right">
          <p class="my-2"><small class="text-gray-400">{{ message.username }}</small></p>
          <span class=" bg-indigo-600 p-2 text-white my-2 rounded-lg"> {{ message.text }}</span>
        </div>
      </ul>
    </div>
    <section class="w-full">
        <iframe v-if="selectedTrackId" style="border-radius:12px" v-for="track in tracks" :key="track.id"
          v-show="track.id === selectedTrackId" class="w-full lg:w-4/5 xl:w-110" height="100"
          :src="'https://open.spotify.com/embed/track/' + track.id + '?utm_source=generator'" frameborder="0"
          allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"></iframe>
      </section>
    <div class="mx-auto sticky left-0 w-full bottom-0 pb-6 bg-white px-4">
      <div class="flex">
        <input type="text" class="text-black px-2 py-3 outline-none rounded w-full bg-gray-100" v-model="messageInput"
          placeholder="Type your message">
        <button @click="sendMessage" class="bg-indigo-600 text-white px-4 ml-2 rounded">Send</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/stores/store';
import { decodeJWT } from '../stores/jwt';
import axios from 'axios';


const store = useAuthStore();


const emit = defineEmits(['toggle-visibility']);

const toggleVisibility = () => {
  emit('toggle-visibility');
};


let userEmail = '';
if (store.token != null) {
  const decodedToken = decodeJWT(store.token);
  userEmail = decodedToken.email;
}

const messageInput = ref('');
const messages = ref(JSON.parse(sessionStorage.getItem('chatMessages')) || []);
const username = ref(userEmail);

let socket;
const serverURL = `${window.location.protocol}//${window.location.host.replace(/:\d+$/, '')}`;
let API_URL = `${serverURL}:3000`;

const URL = `${window.location.protocol}//${window.location.host.replace(/:\d+$/, '')}`;
let API = `${URL}:5000/`;
onMounted(() => {
  socket = io(`${API_URL}`);

  socket.on('message', (data) => {
    messages.value.push(data);
    sessionStorage.setItem('chatMessages', JSON.stringify(messages.value));
  });
});

const sendMessage = () => {
  const message = {
    username: username.value,
    text: messageInput.value
  };
  socket.emit('message', message);
  messageInput.value = '';
};
const selectedTrackId = ref(null);
const tracks = ref([]);
const titleTracks = ref();

watchEffect(() => {
  selectedTrackId.value = store.getTokenID();
  titleTracks.value = store.getTracks();
  console.log(titleTracks.value)
  if (titleTracks.value != null) {
    axios.get(`${API}spotify/${titleTracks.value}`)
      .then((response) => {
        tracks.value = response.data.tracks;

      })
      .catch((error) => {
        console.error('An error occurred while fetching Spotify tracks:', error);
      });
  }
});

</script>
<style scoped>
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
