<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPatientById, updatePatientById } from '@/services/patients';
import { getAllStaff } from '@/services/staffs';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const route = useRoute();
const router = useRouter();
const patientId = props.id || route.params.id;

const formData = ref({
  patient_id: '',
  patient_name: '',
  phone_number: '',
  email: '',
  address: '',
  staff_id: '',
  medical_history: '',
  status: 'Active'
});

const doctors = ref([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref('');

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

onMounted(async () => {
  try {
    // ✅ Kiểm tra token trước khi làm gì
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'You need to login first';
      router.push('/login');
      return;
    }

    console.log('Loading patient with ID:', patientId);
    console.log('Token exists:', !!token);
    
    // ✅ Load riêng từng phần để debug dễ hơn
    let patientData = null;
    let staffData = [];

    // Load patient data
    try {
      patientData = await getPatientById(patientId);
      console.log('✅ Patient loaded:', patientData);
    } catch (patientErr) {
      console.error('❌ Patient error:', patientErr);
      throw patientErr;
    }

    // Load staff data (không bắt buộc)
    try {
      staffData = await getAllStaff();
      console.log('✅ Staff loaded:', staffData.length, 'items');
      doctors.value = staffData.filter(staff => 
        staff.role && staff.role.toLowerCase().includes('doctor')
      );
    } catch (staffErr) {
      console.error('⚠️ Staff error (non-critical):', staffErr);
      // Không throw error cho staff vì không bắt buộc
    }

    // Populate form với patient data
    if (patientData) {
      formData.value = {
        ...patientData,
        date_of_birth: formatDateForInput(patientData.date_of_birth)
      };
    }

  } catch (err) {
    console.error('Error loading data:', err);
    
    // ✅ Xử lý các loại lỗi cụ thể
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please login again.';
      localStorage.removeItem('token'); // Xóa token hết hạn
      setTimeout(() => router.push('/login'), 2000);
    } else if (err.response?.status === 403) {
      error.value = 'You do not have permission to edit this patient.';
    } else if (err.response?.status === 404) {
      error.value = 'Patient not found.';
    } else {
      error.value = err.response?.data?.message || 'Failed to load patient data.';
    }
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    console.log('Updating patient:', patientId, formData.value);
    
    await updatePatientById(patientId, formData.value);
    alert('Patient updated successfully!');
    router.push({
      name: 'PatientDetails',
      params: { id: patientId }
    });
  } catch (err) {
    console.error('Update error:', err);
    
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please login again.';
      localStorage.removeItem('token');
      setTimeout(() => router.push('/login'), 2000);
    } else if (err.response?.status === 403) {
      error.value = 'You do not have permission to update this patient.';
    } else if (err.response) {
      error.value = err.response.data.message || err.response.data.error || 'Failed to update patient.';
    } else if (err.request) {
      error.value = 'Cannot connect to server. Please check your internet connection.';
    } else {
      error.value = `Update failed: ${err.message}`;
    }
    
    alert(error.value);
  } finally {
    submitting.value = false;
  }
};

const handleCancel = () => {
  router.push({
    name: 'PatientDetails',
    params: { id: patientId }
  });
};
</script>

<!-- Template giữ nguyên như cũ -->
<template>
  <div class="edit-patient-container">
    <div class="edit-patient-card">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/patient-list" class="breadcrumb-link">👥 Patients</router-link>
          <span class="breadcrumb-separator">→</span>
          <router-link :to="`/patient-details/${patientId}`" class="breadcrumb-link">
            {{ formData.patient_name || 'Patient' }}
          </router-link>
          <span class="breadcrumb-separator">→</span>
          <span class="breadcrumb-current">Edit</span>
        </div>
        <h1 class="page-title">Edit Patient</h1>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading patient information...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="router.push('/patient-list')" class="btn btn-secondary">
          Back to Patient List
        </button>
      </div>

      <div v-else class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label for="patient_id">Patient ID</label>
              <input 
                type="text" 
                id="patient_id" 
                v-model="formData.patient_id" 
                readonly
                class="readonly"
              />
            </div>

            <div class="form-group">
              <label for="patient_name">Full Name *</label>
              <input 
                type="text" 
                id="patient_name" 
                v-model="formData.patient_name" 
                required
              />
            </div>

            <div class="form-group">
              <label for="date_of_birth">Date of Birth *</label>
              <input 
                type="date" 
                id="date_of_birth" 
                v-model="formData.date_of_birth" 
                required
              />
            </div>

            <div class="form-group">
              <label for="gender">Gender *</label>
              <select id="gender" v-model="formData.gender" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="phone_number">Phone Number</label>
              <input 
                type="tel" 
                id="phone_number" 
                v-model="formData.phone_number"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email"
              />
            </div>

            <div class="form-group full-width">
              <label for="address">Address</label>
              <textarea 
                id="address" 
                v-model="formData.address"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="emergency_contact">Emergency Contact</label>
              <input 
                type="text" 
                id="emergency_contact" 
                v-model="formData.emergency_contact"
              />
            </div>

            <div class="form-group">
              <label for="staff_id">Assigned Doctor</label>
              <select id="staff_id" v-model="formData.staff_id">
                <option value="">Select Doctor</option>
                <option v-for="doctor in doctors" :key="doctor.staff_id" :value="doctor.staff_id">
                  {{ doctor.staff_name }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="medical_history">Medical History</label>
              <textarea 
                id="medical_history" 
                v-model="formData.medical_history"
                rows="4"
                placeholder="Enter patient's medical history..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="formData.status">
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting">Updating...</span>
              <span v-else">Update Patient</span>
            </button>
            <button 
              type="button" 
              @click="handleCancel"
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

<!-- Styles giữ nguyên -->
<style scoped>
/* Same styles as before */
</style>
