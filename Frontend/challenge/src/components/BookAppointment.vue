<template>
	<v-container>
		<v-card-title class="justify-center"> {{ $t('appointmentForm.title') }}</v-card-title>
		<v-form v-model="valid" ref="appointmentForm">
			<v-container>
				<v-row class="ma-4">
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="appointmentToBook.date"
							class="read-only"
							:label="$t('appointmentForm.labels.date')"
							required
							readonly
						></v-text-field>
					</v-col>
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="label"
							class="read-only"
							item-value="appointment.startTime"
							item-text="appointmentToBook.label"
							:label="$t('appointmentForm.labels.startTime')"
							required
							readonly
						></v-text-field>						
					</v-col>
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="appointmentToBook.name"
							:rules="nameRules"
							:counter="30"
							:label="$t('appointmentForm.labels.name')"
							required
						></v-text-field>
					</v-col>
					<v-col
						cols="12"
						md="6"
					>
						<v-text-field
							v-model="appointmentToBook.email"
							:rules="emailRules"
							:counter="40"
							:label="$t('appointmentForm.labels.email')"
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
							@click="postAppointment(appointmentToBook)"
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
		this.label = this.appointmentToBook.label;
	},

	data(){
		return{
			label: null,
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
		}
	},

	methods: {
    async postAppointment(appointmentToBook){
			this.loading = true;
      await axios
			.post(`${process.env.VUE_APP_BACKEND_URL}` + 'appointment', {
				date: appointmentToBook.date,
				name: appointmentToBook.name,
				email: appointmentToBook.email,
				startTime: appointmentToBook.startTime
			})
      .then(response => {
				this.dispatchNotification('appointment.' + response.data.code, 'check-circle', 5000, 'success');
				this.loading = false;
				this.closeDialog();
      })
      .catch(error => {
				this.dispatchNotification('appointment.' + error.response.data.code, 'close-circle', 5000, 'error');
				this.loading = false;
      })
    },
		
		closeDialog(){
			this.appointmentToBook = {};
			this.$refs.appointmentForm.reset();
			this.loading = false;			
			this.showBookDialog = false;
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
		},		
	},

	watch: {
		appointmentToBook: function() {
			this.label = this.appointmentToBook.label;
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