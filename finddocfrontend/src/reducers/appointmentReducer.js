// reducers/appointmentReducer.js

import {
    APPOINTMENT_CREATE_REQUEST,
    APPOINTMENT_CREATE_SUCCESS,
    APPOINTMENT_CREATE_FAIL,
} from '../constants/appointmentConstants';

const initialState = {
    appointment: null,
    loading: false,
    error: null,
};

export const appointmentCreateReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_CREATE_REQUEST:
            return { loading: true };
        case APPOINTMENT_CREATE_SUCCESS:
            return { loading: false, appointment: action.payload, error: null };
        case APPOINTMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
