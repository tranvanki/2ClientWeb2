<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPatientById, updatePatientById } from '@/services/patients';
import { getAllStaff } from '@/services/staffs';

const props = defineProps({
  id: { type: String, required: true }
});
const route = useRoute();
const router = useRouter();
const patientId = props.id || route.params.id;

const formData = ref({
  patient_name: '',
  date_of_birth: '',
  gender: '',
  phone_number: '',
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
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'You need to login first';
      router.push('/login');
      return;
    }
    if (!patientId) {
      error.value = 'Missing patient id!';
      loading.value = false;
      return;
    }

    let patientData = null;
    let staffData = [];
    try {
      patientData = await getPatientById(patientId);
    } catch (patientErr) {
      error.value = 'Cannot load patient!';
      loading.value = false;
      return;
    }
    try {
      staffData = await getAllStaff();
      doctors.value = Array.isArray(staffData)
        ? staffData.filter(staff => staff.role && staff.role.toLowerCase().includes('doctor'))
        : [];
    } catch (staffErr) {
      doctors.value = [];
    }
    if (patientData) {
      formData.value = {
        patient_name: patientData.patient_name || '',
        date_of_birth: patientData.date_of_birth
          ? formatDateForInput(patientData.date_of_birth)
          : '',
        gender: patientData.gender || '',
        phone_number: patientData.phone_number || '',
        staff_id: patientData.staff_id || '',
        medical_history: patientData.medical_history || '',
        status: patientData.status || 'Active'
      };
    }
  } catch (err) {
    error.value = err?.message || 'Unknown error!';
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const payload = { ...formData.value };
    if (!payload.staff_id) payload.staff_id = null;
    await updatePatientById(patientId, payload);
    alert('Patient updated successfully!');
    router.push({
      name: 'PatientDetails',
      params: { id: patientId }
    });
  } catch (err) {
    error.value = err?.message || 'Failed to update patient';
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

<template>
  <div class="edit-patient-container">
    <div class="edit-patient-card">
      <div class="page-header">
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
              <span v-else>Update Patient</span>
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

<style scoped>
/* Bạn có thể giữ lại style cũ hoặc bổ sung cho UI đẹp hơn */
.edit-patient-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}
.edit-patient-card {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.page-header {
  margin-bottom: 1.5rem;
}
.page-title {
  font-size: 2rem;
  font-weight: bold;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-group.full-width {
  grid-column: 1 / span 2;
}
.form-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}
.loading-state, .error-state {
  text-align: center;
  margin: 2rem 0;
}
</style>
