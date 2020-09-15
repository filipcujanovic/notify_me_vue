import Vue from 'vue'
import Vuex from 'vuex'
import { dataService } from '../shared';
import router from '../router';
import { getField, updateField } from 'vuex-map-fields';
import {
  SET_USER,
  SET_ISAUTH,
  SET_LOADING,
  SET_SNACKBAR,
  SET_MUNICIPALITIES,
  SET_NUMBER_OF_PAGES,
  SET_USER_MUNICIPALITIES,
  DELETE_USER_MUNICIPALITIES,
  UPDATE_USER_MUNICIPALITIES,
  SET_USER_BUSSES_FOR_DISPLAY,
  GET_USER_BUSSES,
  SET_BUSSES,
  UPDATE_USER_BUSSES,
  UPDATE_USER_BUSSES_FOR_DISPLAY,
  DELETE_USER_BUSSES
} from './mutation-types';

Vue.use(Vuex);


const state = () => ({
  user: {},
  busses: [],
  snackbars: [],
  user_busses: [],
  user_busses_for_display: [],
  municipalities: [],
  user_municipalities: [],
  number_of_pages: 1,
  isAuth: false,
  loading: false,
});

const isErrorPresent = (data, commit) => {
  if (typeof data.error !== 'undefined') {
    commit(SET_SNACKBAR, {message: data.error, color: 'red'});
    return true;
  } else if (typeof data.message !== 'undefined') {
    commit(SET_SNACKBAR, {message: data.message, color: 'green'});
  }

  return false;
}

function enhanceAcion(actionFn) {
  return function (context, payload)  {
    context.commit(SET_LOADING, true);

    actionFn.call(this, context, payload).then(() => {
      context.commit(SET_LOADING, false);
    })
  }
}

const actions = {
  async loginUserAction({ commit }, data) {
    let response = await dataService.loginUser(data);
    if (!isErrorPresent(response, commit)) {
      commit(SET_USER, response.user);
      commit(SET_ISAUTH, true);
      router.push('busses');
    }
  },
  async checkIsUserAuth({ commit }) {
    const token = localStorage.getItem('token') !== null ? localStorage.getItem('token') : false;
    const user = localStorage.getItem('user') !== null ? localStorage.getItem('user') : false;
    if (token && user) {
      commit(SET_USER, JSON.parse(user));
      commit(SET_ISAUTH, true);
    }
  },
  logoutUser({ commit }) {
    localStorage.removeItem('token');
    commit(SET_USER, {});
    commit(SET_ISAUTH, false);
  },
  async updateUserAction({ commit }, user) {
    let response = await dataService.updateUser(user);
    if (!isErrorPresent(response, commit)) {
      commit(SET_USER, response.user);
    }
  },
  getMunicipalitiesAction: enhanceAcion(async ({ commit }) => {
    let response = await dataService.getMunicipalities();
    if (!isErrorPresent(response, commit)) {
      commit(SET_MUNICIPALITIES, response.results);
    }
  }),
  async getUserMunicipalitiesAction ({ commit }) {
    let response = await dataService.getUserMunicipalities();
    if (!isErrorPresent(response, commit)) {
      commit(SET_USER_MUNICIPALITIES, response.results);
    }
  },
  createUserMunicipalitiesAction: enhanceAcion(async ({ commit }, user_municipalities) => {
    let response = await dataService.createUserMunicipalities(user_municipalities);
    if (!isErrorPresent(response, commit)) {
      commit(UPDATE_USER_MUNICIPALITIES, response.data);
    }
  }),
  deleteUserMunicipalitiesAction: enhanceAcion(async ({ commit }, user_municipalities) => {
    let response = await dataService.deleteUserMunicipalities(user_municipalities);
    if (!isErrorPresent(response, commit)) {
      user_municipalities = user_municipalities.map((municipality) => municipality.municipality_id);
      commit(DELETE_USER_MUNICIPALITIES, user_municipalities);
    }
  }),
  deleteUserBussesAction: enhanceAcion(async ({ commit }, user_busses) => {
    let response = await dataService.deleteUserBusses(user_busses);
    if (!isErrorPresent(response, commit)) {
      user_busses = user_busses.map((bus) => bus.bus_id);
      commit(DELETE_USER_BUSSES, user_busses);
      commit(UPDATE_USER_BUSSES_FOR_DISPLAY);
    }
  }),
  createUserBussesAction: enhanceAcion(async ({ commit }, user_busses) => {
    let response = await dataService.createUserBusses(user_busses);
    if (!isErrorPresent(response, commit)) {
      commit(UPDATE_USER_BUSSES, response.data);
      commit(UPDATE_USER_BUSSES_FOR_DISPLAY);
    }
  }),
  async setLoadingAction({ commit }, loading) {
    commit(SET_LOADING, loading);
  },
  getBussesAction: enhanceAcion(async ({ commit }, page_number) => {
    let response = await dataService.getBusses(page_number);
    if (!isErrorPresent(response, commit)) {
      commit(SET_BUSSES, response.results);
      commit(SET_NUMBER_OF_PAGES, response.total_pages);
    }
  }),
  async getUserBussesAction ({ commit }) {
    let response = await dataService.getUserBusses();
    if (!isErrorPresent(response, commit)) {
      commit(GET_USER_BUSSES, response.results);
    }
  },
  async getDataForBussesEditAction({ commit }, page_number) {
    let bussesResponse = await dataService.getBusses(page_number);
    let bussesUsersResponse = await dataService.getUserBusses();
    if (!isErrorPresent(bussesResponse, commit) && !isErrorPresent(bussesUsersResponse, commit)) {
      commit(SET_BUSSES, bussesResponse.results);
      commit(SET_NUMBER_OF_PAGES, bussesResponse.total_pages);
      commit(GET_USER_BUSSES, bussesUsersResponse.results.filter((bus) => bussesResponse.results.map((current_bus) => current_bus.id).includes(bus.bus_id)));
      commit(SET_USER_BUSSES_FOR_DISPLAY, bussesUsersResponse.results.filter((bus) => bussesResponse.results.map((current_bus) => current_bus.id).includes(bus.bus_id)).map((bus) => bus.bus_id));
    }
  }
};

const mutations = {
  [SET_USER](state, user) {
    state.user = user;
  },
  [SET_ISAUTH](state, isAuth) {
    state.isAuth = isAuth;
  },
  [SET_SNACKBAR](state, snackbar) {
    state.snackbars.push(snackbar);
  },
  [SET_MUNICIPALITIES](state, municipalities) {
    state.municipalities = municipalities;
  },
  [SET_USER_MUNICIPALITIES](state, user_municipalities) {
    state.user_municipalities = user_municipalities;
  },
  [GET_USER_BUSSES](state, user_busses) {
    state.user_busses = user_busses;
  },
  [UPDATE_USER_MUNICIPALITIES](state, user_municipalities) {
    state.user_municipalities = state.user_municipalities.concat(user_municipalities);
  },
  [UPDATE_USER_BUSSES](state, user_busses) {
    state.user_busses = state.user_busses.concat(user_busses);
  },
  [UPDATE_USER_BUSSES_FOR_DISPLAY](state) {
    state.user_busses_for_display = state.user_busses.map((bus) => bus.bus_id);
  },
  [DELETE_USER_MUNICIPALITIES](state, user_municipalities) {
    state.user_municipalities = state.user_municipalities.filter((user_municipality) => !user_municipalities.includes(user_municipality.municipality_id));
  },
  [DELETE_USER_BUSSES](state, user_busses) {
    state.user_busses = state.user_busses.filter((user_bus) => !user_busses.includes(user_bus.bus_id));
  },
  [SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [SET_BUSSES](state, busses) {
    state.busses = busses;
  },
  [SET_USER_BUSSES_FOR_DISPLAY](state, user_busses_for_display) {
    state.user_busses_for_display = user_busses_for_display;
  },
  [SET_NUMBER_OF_PAGES](state, number_of_pages) {
    state.number_of_pages = number_of_pages;
  },
  updateField,
};

const getters = {
  getCurrentUser: state => () => state.user,
  getSnackbars: state => () => state.snackbars,
  getCurrentUserMunicipalitiesForDisplay: state => () => state.user_municipalities.map((municipality) => municipality.municipality_id),
  getCurrentUserMunicipalities: state => () => state.user_municipalities,
  getCurrentUserBussesForDisplay: state => () => state.user_busses_for_display,
  getCurrentUserBusses: state => () => state.user_busses,
  getField,
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
});
