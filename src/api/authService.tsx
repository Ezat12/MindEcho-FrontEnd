import axiosInstance from "./axiosConfig";

const authService = {
  // DOCTOR REGISTER

  registerDoctor: async (doctorData: any) => {
    try {
      const response = await axiosInstance.post(
        "/Auth/register-doctor",
        doctorData,
      );

      const res = response.data;

      if (res?.success && res?.data?.token) {
        localStorage.setItem("token", res.data.token);

        localStorage.setItem("role", "doctor");

        if (res?.data?.doctorId) {
          localStorage.setItem("doctorId", res.data.doctorId);
        }
      }

      return res;
    } catch (error: any) {
      console.error("REGISTER ERROR =>", error?.response?.data);

      throw error;
    }
  },

  // DOCTOR LOGIN

  loginDoctor: async (credentials: any) => {
    try {
      console.log("LOGIN PAYLOAD =>", credentials);

      const response = await axiosInstance.post(
        "/Auth/login-doctor",
        credentials,
      );

      console.log("LOGIN RESPONSE =>", response.data);

      const res = response.data;

      if (res?.success && res?.data?.token) {
        localStorage.setItem("token", res.data.token);

        localStorage.setItem("role", "doctor");

        if (res?.data?.doctorId) {
          localStorage.setItem("doctorId", res.data.doctorId);
        }
      }

      return res;
    } catch (error: any) {
      console.error("LOGIN ERROR FULL =>", error);

      console.error("LOGIN ERROR RESPONSE =>", error?.response?.data);

      throw error;
    }
  },

  // USER REGISTER

  registerUser: async (userData: any) => {
    const response = await axiosInstance.post("/Auth/register-user", userData);

    return response.data;
  },

  // USER LOGIN

  loginUser: async (credentials: any) => {
    const response = await axiosInstance.post("/Auth/login-user", credentials);

    return response.data;
  },

  // LOGOUT
  logout: () => {
    localStorage.clear();

    window.location.href = "/login";
  },
};

export default authService;
