<template>
  <v-app id="app">
    <v-main>
      <Notification/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Notification from '../src/components/Notification.vue'

export default {
  components:{
    Notification
  },

  data(){
    return{
			//
		}
  },
}
</script>

<style>
#app {
  background: url('https://cdn.vuetifyjs.com/images/parallax/material.jpg')
  no-repeat center center fixed !important;
  background-size: cover;
}
</style>