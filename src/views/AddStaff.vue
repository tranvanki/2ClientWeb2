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

      <button type="submit">Submit</button>
    </form>
  </div>
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
import { signup } from '@/services/auth';

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
