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
  date_of_birth: '',
  gender: '',
  phone_number: '',
  email: '',
  address: '',
  emergency_contact: '',
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

<!-- Styles đầy đủ -->
<style scoped>
.edit-patient-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.edit-patient-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  padding: 24px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.breadcrumb {
  font-size: 14px;
  margin-bottom: 12px;
  opacity: 0.9;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
}

.breadcrumb-separator {
  margin: 0 8px;
  opacity: 0.7;
}

.breadcrumb-current {
  opacity: 0.8;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.loading-state, .error-state {
  text-align: center;
  padding: 60px 32px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.form-container {
  padding: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.readonly {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f8fafc;
  color: #475569;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .edit-patient-container {
    padding: 12px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
