<script setup>
import { useAuthStore } from '@/stores/store';
import { ref, onMounted } from 'vue';
import { decodeJWT } from '@/stores/jwt.js';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { API_URL } from '@/api';

const fullname = ref();
const email = ref();
const profile = ref();

const store = useAuthStore();
const userId = ref();
const fetchData = async () => {
    if (store.token) {
        const decoded = decodeJWT(store.token);
        userId.value = decoded.userId;

        await axios.get(`${API_URL}user/${userId.value}`, {
            headers: {
                Authorization: `Bearer ${store.token}`
            }
        }).then((response) => {
            fullname.value = response.data.data[0].fullname;
            email.value = response.data.data[0].email;
            profile.value = response.data.data[0].profile;
        })

    }
}
const showInfo = ref(false);

const edit = () => {
    showInfo.value = !showInfo.value;
};
const closeBasicInfo = ref(false);
const cancelEdit = () => {
    closeBasicInfo.value = true;
    setTimeout(() => {
        showInfo.value = !showInfo.value;
        closeBasicInfo.value = false;
    }, 200);
};


const handleProfileImageChange = (event) => {
    profile.value = event.target.files[0];
}
let save = ref('Save');
const msg = ref();
const toast = ref(false);
const send = (userId) => {
    const id = userId;
    const formData = new FormData();
    save.value = 'Sending';

    formData.append('profile', profile.value);
    formData.append('fullname', fullname.value);

    console.log(id);
    axios.put(`${API_URL}user/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${store.token}`
        }
    }).then((response) => {
        if (response.data.success) {
            setTimeout(() => {
                fetchData();
                save.value = 'Save';
                console.log(response.data.message)
                toast.value = true;
                setTimeout(() => {
                    toast.value = false;
                }, 2000);
            }, 2000)
        } else {
            setTimeout(() => {
                msg.value = response.data.errors[0].msg;
                save.value = 'Save';
                fetchData();
                setTimeout(() => {
                    msg.value = '';
                }, 2000)
            }, 2000)
        }
    });


}

onMounted(fetchData);
</script>
<template>
    <div class="w-full lg:mx-32 xl:mx-32 mx-4 ">
        <div class="toast-container mt-4 w-full left-4 lg:left-32 xl:left-23 top-0 fixed overflow-hidden  z-20 ">
            <div v-show="toast" class="toast-content" :class="{ 'animate-slide-in': toast }">
                <div class="bg-white p-4 w-72 rounded-md border flex items-center">
                    <i class="fas fa-check-circle text-green-500 mx-2"></i>
                    <p class="text-gray-800 mx-4">Your action was completed successfully!</p>
                </div>
            </div>
        </div>
        <section class="text-gray-600 lg:mt-12 xl:mt-12 md:mt-12 mt-6">
            <div class="border-b rounded-bl-lg rounded-br-lg my-7">
                <p class="outfit-header text-gray-600 p-4 border rounded-tl-lg rounded-tr-lg">Basic Info</p>
                <p class="outfit-subtext  border-x p-4">Some info may be visible to other people using Google
                    services. Learn more</p>
                <div class="flex items-center w-full border-x p-4">
                    <div class="lg:flex xl:flex w-2/3">
                        <p class="w-full outfit-header">Profile picture</p>
                        <p class="w-full">A picture helps personalize your account</p>
                    </div>
                    <p class="w-1/3 flex justify-center">
                        <img :src="'../../src/assets/uploads/' + profile" class="h-12 w-12 rounded-full" alt="">
                    </p>
                </div>
                <div class="flex items-center w-full border-x p-4 rounded-bl-lg rounded-br-lg">
                    <div class="lg:flex xl:flex w-full">
                        <p class="w-full outfit-header">Name</p>
                        <p class="w-full">{{ fullname }}</p>
                    </div>
                    <p class="w-1/2 flex justify-center items-center text-indigo-500">
                        <span @click="edit" class="cursor-pointer">
                            <i class="fas fa-edit mx-1"></i>
                            Edit</span>
                    </p>
                </div>
            </div>

            <!-- modal  -->
            <div v-show="showInfo"
                class="animate-slide-in-update flex w-full min-h-full flex-1 flex-col justify-center px-4 py-10 lg:px-8 fixed left-0 top-0 bg-white"
                :class="{ 'animate-slide-out-update': closeBasicInfo }">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
                            class="w-9 h-9 border p-2 rounded-lg" @click="cancelEdit">
                            <path
                                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                        </svg>
                    </p>
                    <h2 class="mt-4  text-3xl leading-9 tracking-tight text-gray-700 outfit-header">To update your name
                        and profile picture, please use the form below.</h2>
                </div>

                <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-6" @submit.prevent="send(userId)">
                        <div>
                            <div class="mt-2">
                                <input id="file" required type="file" accept="image/*"
                                    class="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 outfit-subtext"
                                    placeholder="Username" @change="handleProfileImageChange" />
                            </div>
                        </div>
                        <div>
                            <div class="mt-2">
                                <input id="fullname" name="fullname" v-model="fullname" type="fullname"
                                    autocomplete="fullname" required
                                    class="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 outfit-subtext"
                                    placeholder="Username" />
                            </div>
                            <small v-show="msg" class="mx-4 text-red-500 outfit-subtext">{{ msg }}</small>
                        </div>


                        <div>
                            <button type="submit"
                                class="flex w-full justify-center rounded-md bg-indigo-600 p-4 outfit-font font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{
                                    save }}</button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- contact -->
            <div class="border-b rounded-bl-lg rounded-br-lg my-7">
                <p class="outfit-header text-gray-600 p-4 border rounded-tl-lg rounded-tr-lg">Contact Info</p>
                <p class="outfit-subtext  border-x p-4">The email address used to identify your Google Account to you
                    and others. You can't change this address.</p>
                <div class="flex items-center w-full border-x p-4">
                    <div class="lg:flex xl:flex w-2/3">
                        <p class="w-1/2 outfit-header">Email</p>
                        <p class="w-1/2">{{ email }}</p>
                    </div>

                </div>
            </div>
            <!-- privacy -->
            <div class="border-b rounded-bl-lg rounded-br-lg my-7">
                <p class="outfit-header text-gray-600 p-4 border rounded-tl-lg rounded-tr-lg">Contact Info</p>
                <p class="outfit-subtext  border-x p-4">The email address used to identify your Google Account to you
                    and others. You can't change this address.</p>
                <div class="flex items-center w-full border-x p-4">
                    <div class="lg:flex xl:flex w-full">
                        <p class="w-full outfit-header">Password</p>
                        <p class="w-full">A secure password helps to protect your account.</p>
                    </div>
                    <RouterLink to="/views/changePass" class="w-1/2 flex justify-center items-center text-indigo-500">
                            <i class="fas fa-key mx-1"></i>
                            Change Password
                    </RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>
<style scoped>
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

/* bottom to top */

@keyframes slide-in-update {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

@keyframes slide-out-update {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(100%);
    }
}

.animate-slide-in-update {
    animation: slide-in-update 0.5s forwards;
}

.animate-slide-out-update {
    animation: slide-out-update 0.5s forwards;
}
</style>
