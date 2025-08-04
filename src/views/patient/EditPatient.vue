<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPatientById, updatePatientById } from '@/services/patients';
import { getAllStaff } from '@/services/staffs';

const props = defineProps({
  id: {
    type: String,
    required: true<script setup>
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
  phone_num: '',
  staff_id: '',
  medical_history: '',
  discharge_status: 'pending'
});

const doctors = ref([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'You need to login first';
      router.push('/login');
      return;
    }

    let patientData = null;
    let staffData = [];

    try {
      patientData = await getPatientById(patientId);
    } catch (patientErr) {
      throw patientErr;
    }

    try {
      staffData = await getAllStaff();
      doctors.value = staffData.filter(staff =>
        staff.role && staff.role.toLowerCase().includes('doctor')
      );
    } catch (staffErr) {
      // non-critical
    }

    if (patientData) {
      formData.value = {
        patient_id: patientData.patient_id || '',
        patient_name: patientData.patient_name || '',
        phone_num: patientData.phone_num || '',
        staff_id: patientData.staff_id || '',
        medical_history: patientData.medical_history || '',
        discharge_status: patientData.discharge_status || 'pending'
      };
    }

  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please login again.';
      localStorage.removeItem('token');
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
    await updatePatientById(patientId, formData.value);
    alert('Patient updated successfully!');
    router.push({
      name: 'PatientDetails',
      params: { id: patientId }
    });
  } catch (err) {
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
              <label for="phone_num">Phone Number</label>
              <input 
                type="tel" 
                id="phone_num" 
                v-model="formData.phone_num"
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
              <label for="discharge_status">Discharge Status</label>
              <select id="discharge_status" v-model="formData.discharge_status">
                <option value="pending">Pending</option>
                <option value="discharged">Discharged</option>
                <option value="inactive">Inactive</option>
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
/* Same styles as before */
</style>
  }
});

const route = useRoute();
const router = useRouter();
const patientId = props.id || route.params.id;

const formData = ref({
  patient_id: '',
  patient_name: '',
  phone_num: '',
  staff_id: '',
  medical_history: '',
  discharge_status: 'pending'
});

const doctors = ref([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'You need to login first';
      router.push('/login');
      return;
    }

    let patientData = null;
    let staffData = [];

    try {
      patientData = await getPatientById(patientId);
    } catch (patientErr) {
      throw patientErr;
    }

    try {
      staffData = await getAllStaff();
      doctors.value = staffData.filter(staff =>
        staff.role && staff.role.toLowerCase().includes('doctor')
      );
    } catch (staffErr) {
      // non-critical
    }

    if (patientData) {
      formData.value = {
        patient_id: patientData.patient_id || '',
        patient_name: patientData.patient_name || '',
        phone_num: patientData.phone_num || '',
        staff_id: patientData.staff_id || '',
        medical_history: patientData.medical_history || '',
        discharge_status: patientData.discharge_status || 'pending'
      };
    }

  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please login again.';
      localStorage.removeItem('token');
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
    await updatePatientById(patientId, formData.value);
    alert('Patient updated successfully!');
    router.push({
      name: 'PatientDetails',
      params: { id: patientId }
    });
  } catch (err) {
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
              <label for="phone_num">Phone Number</label>
              <input 
                type="tel" 
                id="phone_num" 
                v-model="formData.phone_num"
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
              <label for="discharge_status">Discharge Status</label>
              <select id="discharge_status" v-model="formData.discharge_status">
                <option value="pending">Pending</option>
                <option value="discharged">Discharged</option>
                <option value="inactive">Inactive</option>
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
/* Same styles as before */
</style>
