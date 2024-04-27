<template>
    <div class="lg:flex xl:flex  lg:mt-20 px-4 lg:px-32 xl:px-32 ">
      <section class="lg:hidden xl:hidden w-full  my-8 md:flex lg:flex xl:flex md:justify-center lg:justify-end xl:justify-end">
        <img src="../assets/play.png" width="300" height="300" class="mx-auto md:mx-0 lg:mx-0 xl:mx-0" alt="">
      </section>
      <section class="lg:w-1/2 xl:w-1/2 w-full md:text-center lg:text-left xl:text-left">
        <p class="text-3xl md:text-4xl lg:text-4xl mx:text-4xl  md:mt-20 lg:mt-20 xl:mt-20 outfit-header text-gray-700 text-center lg:text-left xl:text-left">Welcome to Spotify search music.</p>
        <p class="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl my-8 outfit-subtext text-gray-600 text-center lg:text-left xl:text-left">Discover endless tunes and curate your perfect playlist. Sign up for personalized recommendations or log in to access your favorites.</p>
        <RouterLink to="/signIn" class=" w-full inline-block md:w-1/3 text-center rounded  rounded-md bg-indigo-600 p-4 outfit-font font-bold">Sign In</RouterLink>
      </section>
      <section class="hidden lg:w-1/2 xl:w-1/2 w-full  my-6 lg:flex xl:flex md:justify-center lg:justify-end xl:justify-end">
        <img src="../assets/play.png" width="500" height="500" class="mx-auto md:mx-0 lg:mx-0 xl:mx-0" alt="">
      </section>
    </div>
  </template>