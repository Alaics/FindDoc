import axiosInstance from '../actions/axiosInstance';
import {
  APPOINTMENT_CREATE_REQUEST,
  APPOINTMENT_CREATE_SUCCESS,
  APPOINTMENT_CREATE_FAIL,
} from '../constants/appointmentConstants';

export const createAppointment = (appointmentData) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
        'Content-Type': 'application/json', // Ensure JSON format
      },
    };

    // Ensure that appointmentData is correctly sent as a JSON string
    const { data } = await axiosInstance.post(
      '/api/appointments/create/', 
      JSON.stringify(appointmentData),  // Convert JS object to JSON string
      config
    );

    dispatch({
      type: APPOINTMENT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_CREATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};
