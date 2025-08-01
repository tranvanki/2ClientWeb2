import axios from 'axios';

// ✅ SỬA CHO GIỐNG STAFFS.JS
const backendUrl = 'https://twoserverweb2.onrender.com';  // ← Same as staffs.js

export const login = async (staff_name, password) => {
  try {
    console.log('🔐 Starting login process...');
    
    const response = await axios.post(`${backendUrl}/login`, {  // ← Use backendUrl
      staff_name,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('📡 Raw login response:', response.data);

    const { token, role, staff_id, staff_name: name } = response.data;
    
    // ✅ Store với key 'token' giống staffs.js
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: staff_id,
      name: name || staff_name,
      role: role,
      staff_name: staff_name
    }));
    
    // Lưu cả object và các field riêng lẻ để backward compatibility
    localStorage.setItem('staff_name', name || staff_name); // ← Thêm dòng này
    localStorage.setItem('role', role);                     // ← Thêm dòng này  
    localStorage.setItem('staff_id', staff_id);             // ← Thêm dòng này
    
    console.log('💾 Stored successfully:', { role, name: name || staff_name });
    
    return { token, role, staff_id, staff_name: name || staff_name };
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

export const signup = async (formData) => {
  try {
    const response = await axios.post(`${backendUrl}/signup`, formData, {  // ← Use backendUrl
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// ✅ Get current user info - SỬ DỤNG KEY GIỐNG STAFFS.JS
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');  // ← Same key
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('🔍 Getting current user:', user);
    return user;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// ✅ Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');  // ← Same key as staffs.js
  const user = getCurrentUser();
  const isAuth = !!(token && user);
  
  console.log('🔐 Auth check:', {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated: isAuth,
    userRole: user?.role
  });
  
  return isAuth;
};

// ✅ Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  const role = user?.role || 'guest';
  console.log('👑 User role:', role);
  return role;
};

export const logout = () => {
  console.log('🚪 Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('staff_name');
  localStorage.removeItem('role');
  localStorage.removeItem('staff_id');
};
