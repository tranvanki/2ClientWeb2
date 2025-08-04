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

  // Fix: Do not send empty string for staff_id
  const payload = { ...formData.value };
  if (!payload.staff_id) {
    payload.staff_id = null;
  }

  try {
    await updatePatientById(patientId, payload);
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
