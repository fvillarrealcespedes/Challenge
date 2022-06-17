import Vue from 'vue'
import VueRouter from 'vue-router'
import Appointments from '../views/Appointments.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/appointments',
    name: 'Appointments',
    component: Appointments
  },
  {
    path: '*',
    redirect: '/appointments'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
