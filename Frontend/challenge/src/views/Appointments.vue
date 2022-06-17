<template>
  <v-container>
    <v-dialog
      v-model="showBookDialog"
      max-width="75%"
      width="75%"
      persistent
    >
      <v-card>
        <BookAppointment/>        
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showUpdateDialog"
      max-width="75%"
      width="75%"
      persistent
    >
      <v-card>
        <UpdateAppointment/>        
      </v-card>
    </v-dialog>    
    <div class="ma-8">
      <v-row>
        <v-col
          cols="12"
          sm="4"
          class="my-2 px-1"
        >
          <v-date-picker
            ref="picker"
            v-model="date"
            :picker-date.sync="pickerDate"
            :min="getToday()"
            :first-day-of-week="1"
            full-width
            :locale="$i18n.locale"
            class="elevation-3"
            :allowed-dates="allowedDays"
          ></v-date-picker>
        </v-col>
        <v-col
          cols="12"
          sm="8"
        >
          <ul class="ma-2">
            <v-data-table
              :headers="headers"
              :items="hours"
              class="elevation-3"
              :hide-default-footer="true"
            >
              <template v-slot:top>
                <v-toolbar
                  flat
                >
                  <v-spacer/>
                  <v-toolbar-title> {{ $t('appointments.title') }} <strong>{{ date }}</strong></v-toolbar-title>
                  <v-spacer/>
                </v-toolbar>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">                
                    <v-btn
                      small
                      icon
                      color="success"
                      class="ms-2"
                      @click="bookAppointment(item)"
                      :disabled="item.name!==null || (item.startTime <= getCurrentTime() && isToday())"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-book-clock</v-icon>
                    </v-btn>
                  </template>
                  <span> {{ $t('buttons.schedule') }} </span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">                
                    <v-btn
                      small
                      icon
                      color="primary"
                      class="ms-2"
                      @click="updateAppointment(item._id)"
                      :disabled="item.name===null || (item.startTime <= getCurrentTime() && isToday())"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span> {{ $t('buttons.edit') }} </span>
                </v-tooltip>                
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">                
                    <v-btn
                      small
                      icon
                      color="error"
                      class="ms-2"
                      @click="confirmDelete() && deleteAppointment(item._id)"
                      :disabled="item.name===null || (item.startTime <= getCurrentTime() && isToday())"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span> {{ $t('buttons.delete') }} </span>
                </v-tooltip>
              </template>
            </v-data-table>
          </ul>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';
import BookAppointment from '../components/BookAppointment.vue'
import UpdateAppointment from '../components/UpdateAppointment.vue'

export default {
  components: {
    BookAppointment,
    UpdateAppointment
  },

  mounted(){
    this.appointmentToBook.date = this.date;
    this.setAppointmentsInterval();
  },

  data(){
    return{
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      pickerDate: null,
      allowedDays: val => new Date(val).getDay() !== 5 && new Date(val).getDay() !== 6,
      hours: [
        { label: '9 AM', startTime: 9, _id: null, name: null, email: null },
        { label: '10 AM', startTime: 10, _id: null, name: null, email: null },
        { label: '11 AM', startTime: 11, _id: null, name: null, email: null },
        { label: '12 PM', startTime: 12, _id: null, name: null, email: null },
        { label: '1 PM', startTime: 13, _id: null, name: null, email: null },
        { label: '2 PM', startTime: 14, _id: null, name: null, email: null },
        { label: '3 PM', startTime: 15, _id: null, name: null, email: null },
        { label: '4 PM', startTime: 16, _id: null, name: null, email: null },
        { label: '5 PM', startTime: 17, _id: null, name: null, email: null },
        { label: '6 PM', startTime: 18, _id: null, name: null, email: null }
      ],
      headers: [
        { text: this.$t('appointments.dataTableLabels.startTime'), value: 'label', sortable: false, align: 'end', width: '16%' },
        { text: this.$t('appointments.dataTableLabels.name'), value: 'name', sortable: false, align: 'center', width: '31%' },
        { text: this.$t('appointments.dataTableLabels.email'), value: 'email', sortable: false,  align: 'center', width: '31%' },
        { text: this.$t('appointments.dataTableLabels.actions'), value: 'actions', sortable: false, align: 'center', width: '22%' },
      ],
    }
  },

  methods: {
    setAppointmentsInterval(){
      const hour = 60*60*1000;
      let now = new Date();
      let interval = hour - (now.getMinutes()*60 + now.getSeconds())*1000 - now.getMilliseconds() + 1000;
      this.getToday();
      console.log("La fecha actual es ", this.getToday());
      this.getAppointments(this.date);
      console.log("Entró en", new Date(), "\nSiguiente actualización en " + Math.round(interval/1000) + " segundos");
      setTimeout(() => {
        this.getAppointments(this.date);
        setInterval(this.getAppointments(this.date), hour);
      }, interval);
    },

		async getAppointments(date){
			await axios
			.get(`${process.env.VUE_APP_BACKEND_URL}` + 'appointment/byDate/' + date)
			.then(response => {
        this.processData(response.data.formattedAppointments);
			})
      .catch(error => {
        console.log(error);
      });
		},

		async deleteAppointment(appointmentId){
			await axios
			.delete(`${process.env.VUE_APP_BACKEND_URL}` + 'appointment/' + appointmentId)
			.then(response => {
				this.dispatchNotification('appointment.delete_success', 'check-circle', 5000, 'success');
        this.setAppointmentsInterval();
			})
      .catch(error => {
        console.log(error);
				this.dispatchNotification('appointment.delete_error', 'close-circle', 5000, 'error');
      });
		},    

		confirmDelete(){
    	return confirm(this.$t('appointments.deleteAppoitmentConfirmation'));
		},

    clearHours(){
      this.hours = [
        { label: '9 AM', startTime: 9, _id: null, name: null, email: null },
        { label: '10 AM', startTime: 10, _id: null, name: null, email: null },
        { label: '11 AM', startTime: 11, _id: null, name: null, email: null },
        { label: '12 PM', startTime: 12, _id: null, name: null, email: null },
        { label: '1 PM', startTime: 13, _id: null, name: null, email: null },
        { label: '2 PM', startTime: 14, _id: null, name: null, email: null },
        { label: '3 PM', startTime: 15, _id: null, name: null, email: null },
        { label: '4 PM', startTime: 16, _id: null, name: null, email: null },
        { label: '5 PM', startTime: 17, _id: null, name: null, email: null },
        { label: '6 PM', startTime: 18, _id: null, name: null, email: null }
      ];
      return; 
    },

    processData(data){
      if(!data.length){
        return;
      }
      else{
        this.clearHours();
        data.forEach(element => {
          this.hours.find(innerElement => {
            if(innerElement.startTime === element.startTime){
              innerElement._id = element._id,
              innerElement.name = element.name,
              innerElement.email = element.email
            }
          });
        });
      }
    },

    getCurrentTime(){
      return new Date().getHours();
    },

    getToday(){
      return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
    },

    isToday(){
      if((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10) === this.date){
        return true;
      }
      return false;
    },

    bookAppointment(appointment){
      this.appointmentToBook = appointment;
      this.appointmentToBook.date = this.date;
      this.showBookDialog = true;
    },

    updateAppointment(appointmentId){
      this.updateAppointmentId = appointmentId;
      this.showUpdateDialog = true;
    },

		dispatchNotification(text, icon, timeout, color){
			let notification = {
				show: true,
				text: 'notifications.' + text,
				icon: 'mdi-' + icon,
				timeout: timeout,
				color: color
			}
			this.$store.dispatch('showNotification', notification);
		}
	},

  watch: {
    date: function(){
      this.clearHours();
      this.appointmentToBook.date = this.date;
      this.setAppointmentsInterval();
    },

    showBookDialog: function(){
      if(!this.showBookDialog){
        this.setAppointmentsInterval();
      }
    },

    showUpdateDialog: function(){
      if(!this.showUpdateDialog){
        this.setAppointmentsInterval();
      }
    }
  },

	computed: {
		appointmentToBook: {
      get () {
        return this.$store.getters.getAppointmentToBook;
      },
      set (payload) {
        this.$store.commit('setAppointmentToBook', payload);
      }
		},

		showBookDialog: {
      get () {
        return this.$store.getters.getShowBookDialog;
      },
      set (payload) {
        this.$store.commit('setShowBookDialog', payload);
      }
		},

		showUpdateDialog: {
      get () {
        return this.$store.getters.getShowUpdateDialog;
      },
      set (payload) {
        this.$store.commit('setShowUpdateDialog', payload);
      }
		},

		updateAppointmentId: {
      get () {
        return this.$store.getters.getUdateAppointmentId;
      },
      set (payload) {
        this.$store.commit('setUpdateAppointmentId', payload);
      }
		}    
	} 

}
</script>

<style>

</style>