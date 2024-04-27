<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/store';
import { API_URL } from '@/api';

const users = ref([]);
const store = useAuthStore();
const fetchData = () => {
    axios.get(`${API_URL}user`, {
        headers: {
            Authorization: `Bearer ${store.token}`
        }
    }).then((Response) => {
        users.value = Response.data.data;
    }).catch((err) => {
        console.log("error")
    });
}
onMounted(fetchData);
</script>
<template>
    <section class="w-full ">
        <div class="w-full lg:flex xl:flex md:flex  items-center  lg:px-32 xl:px-32 px-4  py-12 ">
            <div v-for="user in users" :key="user.user_id"
                class="border hover:bg-gray-50 text-gray-600 w-full mx-auto  md:w-72 xl:w-72 lg:w-72 rounded-lg py-6 my-2">
                <img :src="'../../src/assets/uploads/' + user.profile" class="h-20 w-20 mx-auto my-2 rounded-full border"
                    alt="">
                <p class="text-center outfit-header py-2">{{ user.fullname }}</p>
                <p class="text-center outfit-subtext py-2">{{ user.email }}</p>
            </div>
        </div>
    </section>
</template>