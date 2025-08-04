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
  patient_id: '',
  patient_name: '',
  phone_number: '',
  email: '',
  address: '',
  staff_id: '',
  medical_history: '',
  status: 'Active',
  date_of_birth: '',
  gender: '',
  emergency_contact: ''
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
      error.value = 'Cannot load patient!'; // không throw để không crash
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
        ...formData.value,
        ...patientData,
        date_of_birth: patientData.date_of_birth
          ? new Date(patientData.date_of_birth).toISOString().split('T')[0]
          : ''
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
    delete payload.patient_id; // không update id
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

<!-- Template giữ nguyên như bạn gửi -->
