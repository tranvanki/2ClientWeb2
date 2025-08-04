<template>
  <div class="add-staff-container">
    <div class="add-staff-card">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/staff-list" class="breadcrumb-link">👥 Staff</router-link>
          <span class="breadcrumb-separator">→</span>
          <span class="breadcrumb-current">Add New Staff</span>
        </div>
        <h1 class="page-title">Add New Staff Member</h1>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="staff_id">Staff ID:</label>
            <input type="text" id="staff_id" v-model="formData.staff_id" required />
          </div>

          <div class="form-group">
            <label for="staff_name">Username:</label>
            <input type="text" id="staff_name" v-model="formData.staff_name" required />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="formData.email" required />
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              required
            />
          </div>

          <div class="form-group">
            <label for="date_of_birth">Date of Birth:</label>
            <input
              type="date"
              id="date_of_birth"
              v-model="formData.date_of_birth"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              required
            />
          </div>

          <!-- Additional Info -->
          <div class="form-group">
            <label for="department">Department:</label>
            <input
              type="text"
              id="department"
              v-model="formData.department"
              required
            />
          </div>

          <div class="form-group">
            <label for="specialization">Specialization:</label>
            <input
              type="text"
              id="specialization"
              v-model="formData.specialization"
              required
            />
          </div>

          <div class="form-group">
            <label for="shift_time">Shift Time:</label>
            <select id="shift_time" v-model="formData.shift_time" required>
              <option value="">Select Shift</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
          </div>

          <div class="form-group">
            <label for="role">Role:</label>
            <input type="text" id="role" v-model="formData.role" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting">Creating...</span>
              <span v-else>Create Staff Member</span>
            </button>
            <button 
              type="button" 
              @click="$router.push('/staff-list')"
              class="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup } from '@/services/auth';

const router = useRouter();

const formData = ref({
  staff_id: '',
  staff_name: '',
  email: '',
  password: '',
  date_of_birth: '',
  phone: '',
  role: '',
  department: '',
  specialization: '',
  shift_time: ''
});

const submitting = ref(false);

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    // Use the signup function to create the staff member
    const staffData = {
      ...formData.value,
      username: formData.value.staff_name, // Map staff_name to username if needed
      // Add any other field mappings required by your signup function
    };
    
    await signup(staffData);
    alert('Staff member created successfully!');
    router.push('/staff-list');
  } catch (error) {
    console.error('Error creating staff:', error);
    alert(error.response?.data?.message || 'Failed to create staff member');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.add-staff-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.add-staff-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #374151;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #9ca3af;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.form-container {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>
