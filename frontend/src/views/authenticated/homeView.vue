<script setup>
import { API_URL } from '@/api';
import axios from 'axios';
import { ref } from 'vue';

const artists = ref([]);

    axios.get(`${API_URL}spotify-artist`)
        .then((response) => {
            artists.value = response.data.tracks;
            console.log(artists.value);
        })
        .catch((error) => {
            console.error('An error occurred while fetching Spotify artists:', error);
        });

</script>
<template>
    <section class="w-full">
    <div class=" md:flex lg:flex xl:flex justify-between items-center px-4 xl:px-32 lg:px-32 py-12">
    <h1 class="text-indigo-600 text-2xl  outfit-header">Top Artist</h1>
    <button class="outfit-subtext text-indigo-600 lg:border xl:border md:border lg:px-4 xl:px-4 px-1 md:px-4 py-2 rounded-md hover:bg-gray-50"><i class="fas fa-arrow-right mr-2 text-indigo-600"></i>See more</button>
    </div>
   <div class=" lg:flex xl:flex md:flex md:flex-wrap w-full py-0 lg:justify-between xl:justify-between md:justify-between pb-12 lg:px-32 xl:px-32 px-4">
    <div v-for="(artist, index) in artists" :key="index" class="border p-4 rounded-lg  my-2 hover:bg-gray-50
    ">
      <img v-if="artist.images.length" :src="artist.images[0].url" alt="Artist Image"  class="w-full h-full md:w-72 md:h-72 lg:w-72 xl:w-72 lg:h-72 xl:h-72 rounded-lg" />
      <h1 class="text-gray-600 py-1 outfit-header">Artist: <span class="outfit-subtext">{{ artist.name }}</span></h1>
      <p v-if="artist.followers" class="text-gray-500 py-1 outfit-header">Followers: <span class="outfit-subtext"> {{ artist.followers.total }} </span></p>
      <p v-if="artist.genres.length" class="text-gray-500 py-1 outfit-header">Genres: <span class="outfit-subtext">{{ artist.genres[0] }} </span></p>
    </div>
  </div>
</section>
</template>