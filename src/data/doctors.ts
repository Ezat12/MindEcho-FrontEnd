// data/doctors.ts
import axiosInstance from "../api/axiosConfig";
import type { IDoctor } from "../types/IDoctor";

export const DoctorsData = async (): Promise<IDoctor[]> => {
  try {
    const res = await axiosInstance.get(
      `/Doctor/All?pageSize=100&pageNumber=1`,
    );

    console.log("API response for doctors:", res.data);

    // ✅ استخراج الدكاترة من الـ response بشكل صحيح
    let doctors: IDoctor[] = [];

    // الحالة: data.data[0].doctors
    if (
      res.data?.data &&
      Array.isArray(res.data.data) &&
      res.data.data[0]?.doctors
    ) {
      doctors = res.data.data[0].doctors;
      console.log("Extracted from data[0].doctors");
    }
    // الحالة: data.doctors
    else if (res.data?.doctors && Array.isArray(res.data.doctors)) {
      doctors = res.data.doctors;
      console.log("Extracted from data.doctors");
    }
    // الحالة: data.data array من الدكاترة
    else if (res.data?.data && Array.isArray(res.data.data)) {
      doctors = res.data.data;
      console.log("Extracted from data.data");
    }
    // الحالة: data نفسها array
    else if (Array.isArray(res.data)) {
      doctors = res.data;
      console.log("Extracted from data itself");
    }

    console.log("Fetched doctors count:", doctors.length);
    console.log("First doctor:", doctors[0]);

    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};
