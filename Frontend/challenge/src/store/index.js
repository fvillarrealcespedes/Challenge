import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		appointmentToBook: {},
		showBookDialog: null,
		showUpdateDialog: null,
    snackbar: {
      show: null,
      icon: null,
      text: null,
      timeout: null,
      color: null
    },
		updateAppointmentId: null,
	},

	actions: {
    showNotification(context, payload){
      context.commit('setSnackbar', payload);
    }
	},

	mutations: {
		setAppointmentToBook(state, payload){
			state.appointmentToBook = payload;
		},

		setShowBookDialog(state, payload){
			state.showBookDialog = payload;
		},

		setShowUpdateDialog(state, payload){
			state.showUpdateDialog = payload;
		},

		setSnackbar(state, payload){
      state.snackbar.show = payload.show;
      state.snackbar.text = payload.text;
			state.snackbar.icon = payload.icon;
      state.snackbar.timeout = payload.timeout;
      state.snackbar.color = payload.color;
    },

		setUpdateAppointmentId(state, payload){
			state.updateAppointmentId = payload;
		}	
	},

	getters: {
		getAppointmentToBook(state){
			return state.appointmentToBook;
		},

		getShowBookDialog(state){
			return state.showBookDialog;
		},

		getShowUpdateDialog(state){
			return state.showUpdateDialog;
		},		

		getSnackbar(state){
			return state.snackbar;
		},

		getUpdateAppointmentId(state){
			return state.updateAppointmentId;
		}
	}
	
});