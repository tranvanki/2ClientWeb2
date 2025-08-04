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
          <div class="form-grid">
            <div class="form-group">
              <label for="staff_name">Full Name *</label>
              <input 
                type="text" 
                id="staff_name" 
                v-model="formData.staff_name" 
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Password *</label>
              <input 
                type="password" 
                id="password" 
                v-model="formData.password" 
                required
                minlength="6"
              />
            </div>

            <div class="form-group">
              <label for="role">Role *</label>
              <select id="role" v-model="formData.role" required>
                <option value="">Select Role</option>
                <!-- ✅ CHỈ CÓ 2 ROLE THEO DATABASE -->
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone"
              />
            </div>

            <div class="form-group">
              <label for="department">Department</label>
              <input 
                type="text" 
                id="department" 
                v-model="formData.department"
              />
            </div>
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
import { createStaff } from '@/services/staffs';

const router = useRouter();

const formData = ref({
  staff_name: '',
  email: '',
  password: '',
  role: '',
  phone: '',
  department: '',
  specialization: ''
});

const submitting = ref(false);

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    await createStaff(formData.value);
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

<!-- ...existing styles... -->
