<template>
    <section>
      <div class="w-full py-6" style="max-height: 600px; overflow-y: auto; height: 65vh;">
        <ul class="my-2">
          <div v-for="(message, index) in messages" :key="index">
            <div v-if="message.username === username">
              <p class="my-2"> <small class="mr-2 text-gray-400">You </small></p>
              <span class=" bg-indigo-600 p-2 text-white my-2 rounded-lg"> {{ message.text }}</span>
            </div>
            <div v-else class="text-right">
              <p class="my-2"><small class="text-gray-400">{{ message.username }}</small></p>
              <span class=" bg-indigo-600 p-2 text-white my-2 rounded-lg"> {{ message.text }}</span>
            </div>
          </div>
        </ul>
      </div>
      <div class="mx-auto fixed left-0 px-4 lg:px-32 xl:px-32 w-full bottom-10">
        <div class="flex">
          <input type="text" class="text-black px-2 py-3 outline-none rounded w-full" v-model="messageInput" placeholder="Type your message">
          <button @click="sendMessage" class="bg-indigo-600 text-white px-4 ml-2 rounded">Send</button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import io from 'socket.io-client';

const messageInput = ref('');
const messages = ref([]);
const username = ref(sessionStorage.getItem('You')); 


const socket = io('http://localhost:4000');

const fetchMessages = async () => {
    try {
        const response = await axios.get('http://localhost:4000/messages');
        messages.value = response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

const sendMessage = async () => {
    const message = {
        username: username.value,
        text: messageInput.value
    };

    try {
        await axios.post('http://localhost:4000/messages', message);
        messageInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

socket.on('message', (message) => {
    messages.value.push(message);
});

onMounted(fetchMessages); 
</script>

  
  <style scoped>
  /* Custom scrollbar styles */
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
  