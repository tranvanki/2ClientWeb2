import axios from 'axios';

const backendUrl = 'https://twoserverweb2.onrender.com';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json' // ← Add this
} : {
      'Content-Type': 'application/json'

};
}

export const getAllStaff = async () => {
  try {
    const response = await axios.get(`${backendUrl}/staffs`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff list:', error);
    throw error;
  }
};

export const getStaffById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}/staffs/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error);
    throw error;
  }
};

export const createStaff = async (staffData) => {
  try {
    const response = await axios.post(`${backendUrl}/staffs`, staffData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

export const updateStaff = async (id, staffData) => {
  try {
    const response = await axios.put(`${backendUrl}/staffs/${id}`, staffData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

export const deleteStaff = async (id) => {
  try {
    const response = await axios.delete(`${backendUrl}/staffs/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};



