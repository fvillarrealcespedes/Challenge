<template>
	<v-container>
		<v-card-title class="justify-center"> {{ $t('updateAppointmentForm.title') }}</v-card-title>
		<v-form v-model="valid" ref="updateAppointmentForm">
			<v-container>
				<v-row class="ma-4">
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="appointment.date"
							class="read-only"
							:label="$t('updateAppointmentForm.labels.date')"
							required
							readonly
						></v-text-field>
					</v-col>
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="appointment.label"
							class="read-only"
							item-text="appointment.label"
							item-value="appointment.startTime"
							:label="$t('updateAppointmentForm.labels.startTime')"
							required
							readonly
						></v-text-field>						
					</v-col>
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="appointment.name"
							:rules="nameRules"
							:counter="30"
							:label="$t('updateAppointmentForm.labels.name')"
							required
						></v-text-field>
					</v-col>
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="appointment.email"
							:rules="emailRules"
							:counter="40"
							:label="$t('updateAppointmentForm.labels.email')"
							required
						></v-text-field>
					</v-col>
				</v-row>
				<v-card-actions class="ma-8">
					<v-row justify="center">
						<v-btn
							rounded
							color="error"
							class="ms-8"
							@click="closeDialog()"
						>
							{{ $t('buttons.cancel') }}
						</v-btn>					
						<v-btn
							rounded
							color="success"
							class="ms-8"
							@click="updateAppointment(appointment, appointment._id)"
							:disabled="!valid"
							:loading="loading"
						>
							{{ $t('buttons.save') }}
						</v-btn>
					</v-row>
				</v-card-actions>
			</v-container>
		</v-form>
	</v-container>
</template>

<script>
import axios from 'axios';

export default {
	mounted(){
		this.getAppointment(this.updateAppointmentId);
	},

	data(){
		return{
			appointment: {},
			loading: null,
			valid: false,
      nameRules: [
        v => !!v || this.$t('rules.requiredRule'),
				v => (v && (/\S/.test(v))) || this.$t('rules.spacesRule'),
        v => (v && v.length <= 30) || this.$t('rules.maxLength30'),
        v => (v && v.length >= 5) || this.$t('rules.minLength5'),
      ],
      emailRules: [
        v => !!v || this.$t('rules.requiredRule'),
        v => (v && v.length <= 30) || this.$t('rules.maxLength30'),
        v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(v) || this.$t('rules.emailRule'),
      ],
      hours: [
        { label: '9 AM', startTime: 9 },
        { label: '10 AM', startTime: 10 },
        { label: '11 AM', startTime: 11 },
        { label: '12 PM', startTime: 12 },
        { label: '1 PM', startTime: 13 },
        { label: '2 PM', startTime: 14 },
        { label: '3 PM', startTime: 15 },
        { label: '4 PM', startTime: 16 },
        { label: '5 PM', startTime: 17 },
        { label: '6 PM', startTime: 18 }
      ]
		}
	},

	methods: {
		async getAppointment(appointmentId){
			await axios
			.get(`${process.env.VUE_APP_BACKEND_URL}` + 'appointment/byId/' + appointmentId)
			.then(response => {
				this.appointment = response.data.formattedAppointment;
				this.appointment.label = this.hours.find(element => element.startTime === this.appointment.startTime).label;
			})
      .catch(error => {
        console.log(error);
      })			
		},

		async updateAppointment(appointment, appointmentId){
			this.loading = true;
			let label = appointment['label'];
      delete appointment['label'];
      await axios
			.put(`${process.env.VUE_APP_BACKEND_URL}` + 'appointment/' + appointmentId, appointment)
      .then(response => {
				this.dispatchNotification('appointment.update_success', 'check-circle', 5000, 'success');
				this.loading = false;
				this.closeDialog();
      })
      .catch(error => {
				console.log(error);
				this.dispatchNotification('appointment.update_error', 'close-circle', 5000, 'error');
				this.loading = false;
				appointment.label = label;
      })
    },
		
		closeDialog(){
			this.$refs.updateAppointmentForm.reset();
			this.loading = false;			
			this.showUpdateDialog = false;
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

	computed: {
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
        return this.$store.getters.getUpdateAppointmentId;
      },
      set (payload) {
        this.$store.commit('setUpdateAppointmentId', payload);
      }
		}	
	},

  watch: {
    showUpdateDialog: function(){
      if(this.showUpdateDialog){
				this.getAppointment(this.updateAppointmentId);
      }
    }
  }
}
</script>

<style scoped>
.read-only >>> input{
	cursor: auto;
}
.read-only .v-text-field fieldset, .v-text-field .v-input__control{
	cursor: auto;
}
.read-only >>> .v-input__slot::before {
  border-style: none !important;
}
</style>