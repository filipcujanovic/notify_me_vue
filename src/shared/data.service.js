import * as axios from 'axios';

import { API } from './config';

axios.defaults.baseURL = API;

axios.interceptors.request.use(function (config) {
    if (localStorage.getItem('token')) {
        config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }
    return config;
});

const loginUser = async function(data) {
    let returnData = {message: 'Successful login'};
    try {
        let response = await axios.post('api-token-auth/', data);
        response = parseResponse(response, 200);

        if (typeof response !== 'undefined') {
            localStorage.setItem('token', response.token);
            let user = await getCurrentUser();
            localStorage.setItem('user', JSON.stringify(user));
            returnData.user = user;
        }
        return returnData;
    } catch (error) {
        return {error: 'Username or password is incorrect'}
    }
};

const getUser = async function(username) {
    try {
        let response = await axios.get(`/users/?username=${username}`);
        response = parseResponse(response, 200);
        return response.results[0];
    } catch (error) {
        return {error: error.message}
    }
};

const getCurrentUser = async function() {
    try {
        let response = await axios.get('/me/');
        response = parseResponse(response, 200);
        return response;
    } catch (error) {
        return {error: error.message}
    }
};

const updateUser = async function(user) {
    try {
        let response = await axios.patch(`/users/${user.id}/`, user); 
        response = parseResponse(response, 200);
        return response;
    } catch (error) {
        return {error: error.message}
    }
};

const getMunicipalities = async function() {
    try {
        let response = await axios.get(`/municipalities/`); 
        response = parseResponse(response, 200);
        return response;
    } catch (error) {
        return {error: error.message}
    }
}

const getUserMunicipalities = async function() {
    try {
        let response = await axios.get(`/municipalities_users/`); 
        response = parseResponse(response, 200);
        return response;
    } catch (error) {
        return {error: error.message}
    }
}

const createUserMunicipalities = async function(user_municipalities) {
    try {
        let response = await axios.post(`/municipalities_users/`,user_municipalities); 
        response = parseResponse(response, 201);
        response['data'] = response;
        response['message'] = 'Saved!';
        return response;
    } catch (error) {
        return {error: error.message}
    }
}

const deleteUserMunicipalities = async function(user_municipalities) {
    try {
        for (let muncipality of user_municipalities) {
            let response = await axios.delete(`/municipalities_users/${muncipality.id}/`); 
            parseResponse(response, 204);
        }
        let message = {'message': 'Saved!'};
        return message;
    } catch (error) {
        return {error: error.message}
    }
}

const deleteUserBusses = async function(user_busses) {
    try {
        for (let bus of user_busses) {
            let response = await axios.delete(`/busses_users/${bus.id}/`); 
            parseResponse(response, 204);
        }
        let message = {'message': 'Saved!'};
        return message;
    } catch (error) {
        return {error: error.message}
    }
}

const createUserBusses = async function(user_busses) {
    try {
        let response = await axios.post(`/busses_users/`,user_busses); 
        response = parseResponse(response, 201);
        response['data'] = response;
        response['message'] = 'Saved!';
        return response;
    } catch (error) {
        return {error: error.message}
    }
}

const getBusses = async function(number_of_page = 1) {
    try {
        let response = await axios.get(`/busses/?page=${number_of_page}`); 
        response = parseResponse(response, 200);
        return response;
    } catch (error) {
        return {error: error.message}
    }
}

const getUserBusses = async function() {
    try {
        let response = await axios.get(`/busses_users/`); 
        response = parseResponse(response, 200);
        return response;
    } catch (error) {
        return {error: error.message}
    }
}

export const parseResponse = (response, code) => {
    if (response.status !== code) throw Error(response.message);
    let data = response.data;
    if (typeof data !== 'object' && response.status !== 204) {
        throw Error({error: 'Interval server error'});
    }
    return data;
  };

export const dataService = {
    updateUser,
    loginUser,
    getUser,
    getCurrentUser,
    getMunicipalities,
    getUserMunicipalities,
    createUserMunicipalities,
    deleteUserMunicipalities,
    createUserBusses,
    deleteUserBusses,
    getBusses,
    getUserBusses,
};
