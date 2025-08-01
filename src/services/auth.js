import axios from 'axios';

const backendUrl = 'https://twoserverweb2.onrender.com';

/**
 * 🔐 User login function
 * @param {string} staff_name - Staff username
 * @param {string} password - Staff password
 * @returns {Promise<object>} Login response with token and user info
 */
export const login = async (staff_name, password) => {
  try {
    console.log('🔐 Starting login process...');
    
    const response = await axios.post(`${backendUrl}/login`, {
      staff_name,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('📡 Login response received');

    const { token, role } = response.data;
    
    if (!token || !role) {
      throw new Error('Invalid server response: missing token or role');
    }
    
    console.log('✅ Login successful');
    
    // Store authentication data
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('staff_name', staff_name);
    localStorage.setItem('staff_id', 'logged_in_user');
    
    // Store user object for admin dashboard
    localStorage.setItem('user', JSON.stringify({
      id: 'logged_in_user',
      name: staff_name,
      role: role,
      staff_name: staff_name
    }));
    
    console.log('💾 User data stored successfully');
    
    return { token, role, staff_id: 'logged_in_user', staff_name };
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

/**
 * 👤 User signup function
 * @param {object} formData - User registration data
 * @returns {Promise<object>} Signup response
 */
export const signup = async (formData) => {
  try {
    const response = await axios.post(`${backendUrl}/signup`, formData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('❌ Signup error:', error);
    throw error;
  }
};

/**
 * 🔍 Get current logged-in user
 * @returns {object|null} User object or null if not found
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('🔍 Getting current user:', user?.name || 'Not found');
    return user;
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    return null;
  }
};

/**
 * 🚪 User logout function
 * Clears all authentication data from localStorage
 */
export const logout = () => {
  console.log('🚪 Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('staff_name');
  localStorage.removeItem('role');
  localStorage.removeItem('staff_id');
  localStorage.removeItem('_id');
  localStorage.removeItem('id');
  console.log('✅ Logout completed');
};
