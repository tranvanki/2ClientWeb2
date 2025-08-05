<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const doctorName = ref('Doctor')
const stats = ref({
  totalPatients: 0,
  todayAppointments: 0,
  pendingVitals: 0,
  completedRecords: 0
})

// Fetch doctor info and stats
onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    // Get doctor name
    doctorName.value = localStorage.getItem('staff_name') || 'doctor'
    
    // Set default stats for now
    stats.value = {
      totalPatients: 42,
      todayAppointments: 8,
      pendingVitals: 5,
      completedRecords: 127
    }
    
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
    // Use fallback data if API fails
    stats.value = {
      totalPatients: 42,
      todayAppointments: 8,
      pendingVitals: 5,
      completedRecords: 127
    }
  }
})
</script>

<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="breadcrumb">
          <span class="breadcrumb-item">🏠 Dashboard</span>
        </div>
        <h1 class="dashboard-title">
          Dashboard
        </h1>
        <p class="dashboard-subtitle">Welcome back, Dr. {{ doctorName }}</p>
      </div>
      
      <!-- Stats Cards Row -->
      <div class="stats-row">
        <div class="stat-card blue">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Total Patients</div>
            <div class="stat-value">{{ stats.totalPatients }}</div>
          </div>
        </div>
        
        <div class="stat-card green">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-label">Today Appointments</div>
            <div class="stat-value">{{ stats.todayAppointments }}</div>
          </div>
        </div>
        
        <div class="stat-card orange">
          <div class="stat-icon">❤️</div>
          <div class="stat-content">
            <div class="stat-label">Pending Vitals</div>
            <div class="stat-value">{{ stats.pendingVitals }}</div>
          </div>
        </div>
        
        <div class="stat-card red">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-label">Medical Records</div>
            <div class="stat-value">{{ stats.completedRecords }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="dashboard-grid">
      <!-- Quick Actions Card -->
      <div class="card quick-actions">
        <div class="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div class="card-body">
          <div class="action-buttons">
            <router-link to="/patient-list" class="action-btn primary">
              <div class="btn-icon">👥</div>
              <div class="btn-text">
                <span class="btn-title">My Patients</span>
                <span class="btn-subtitle">View & manage patients</span>
              </div>
            </router-link>
            
            <router-link to="/create-patient" class="action-btn success">
              <div class="btn-icon">➕</div>
              <div class="btn-text">
                <span class="btn-title">Add Patient</span>
                <span class="btn-subtitle">Register new patient</span>
              </div>
            </router-link>
            
            <router-link to="/vitals-list" class="action-btn warning">
              <div class="btn-icon">❤️</div>
              <div class="btn-text">
                <span class="btn-title">Vitals</span>
                <span class="btn-subtitle">Check vital signs</span>
              </div>
            </router-link>
            
            <router-link to="/record-list" class="action-btn info">
              <div class="btn-icon">📄</div>
              <div class="btn-text">
                <span class="btn-title">Medical Records</span>
                <span class="btn-subtitle">View patient records</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Patients Card -->
      <div class="card recent-patients">
        <div class="card-header">
          <h3>Recent Patients</h3>
          <router-link to="/patient-list" class="view-all">View All</router-link>
        </div>
        <div class="card-body">
          <div class="patient-list">
            <div class="patient-item">
              <div class="patient-avatar">JD</div>
              <div class="patient-info">
                <div class="patient-name">John Doe</div>
                <div class="patient-time">2 hours ago</div>
              </div>
              <div class="patient-status pending">Pending</div>
            </div>
            
            <div class="patient-item">
              <div class="patient-avatar">MS</div>
              <div class="patient-info">
                <div class="patient-name">Mary Smith</div>
                <div class="patient-time">5 hours ago</div>
              </div>
              <div class="patient-status completed">Completed</div>
            </div>
            
            <div class="patient-item">
              <div class="patient-avatar">RJ</div>
              <div class="patient-info">
                <div class="patient-name">Robert Johnson</div>
                <div class="patient-time">1 day ago</div>
              </div>
              <div class="patient-status in-progress">In Progress</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Schedule Card -->
      <div class="card schedule">
        <div class="card-header">
          <h3>Today's Schedule</h3>
        </div>
        <div class="card-body">
          <div class="schedule-list">
            <div class="schedule-item">
              <div class="schedule-time">09:00 AM</div>
              <div class="schedule-info">
                <div class="schedule-title">Patient Consultation</div>
                <div class="schedule-patient">Alice Cooper</div>
              </div>
            </div>
            
            <div class="schedule-item">
              <div class="schedule-time">11:30 AM</div>
              <div class="schedule-info">
                <div class="schedule-title">Vital Signs Check</div>
                <div class="schedule-patient">Bob Wilson</div>
              </div>
            </div>
            
            <div class="schedule-item">
              <div class="schedule-time">02:00 PM</div>
              <div class="schedule-info">
                <div class="schedule-title">Follow-up Appointment</div>
                <div class="schedule-patient">Carol Davis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 30px;
}

.header-content {
  margin-bottom: 20px;
}

.breadcrumb {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 10px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 5px 0;
}

.dashboard-subtitle {
  color: #6c757d;
  margin: 0;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.blue { border-left: 4px solid #007bff; }
.stat-card.green { border-left: 4px solid #28a745; }
.stat-card.orange { border-left: 4px solid #fd7e14; }
.stat-card.red { border-left: 4px solid #dc3545; }

.stat-icon {
  font-size: 32px;
  margin-right: 15px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #343a40;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #343a40;
}

.view-all {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.card-body {
  padding: 20px;
}

/* Quick Actions */
.quick-actions {
  grid-column: 1 / -1;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.action-btn.primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.action-btn.success {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
}

.action-btn.warning {
  background: linear-gradient(135deg, #fd7e14, #e55a00);
  color: white;
}

.action-btn.info {
  background: linear-gradient(135deg, #17a2b8, #117a8b);
  color: white;
}

.btn-icon {
  font-size: 24px;
  margin-right: 15px;
}

.btn-text {
  display: flex;
  flex-direction: column;
}

.btn-title {
  font-weight: 600;
  font-size: 16px;
}

.btn-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

/* Recent Patients */
.patient-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.patient-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  background: #f8f9fa;
}

.patient-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 15px;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-weight: 600;
  color: #343a40;
}

.patient-time {
  font-size: 12px;
  color: #6c757d;
}

.patient-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.patient-status.pending {
  background: #fff3cd;
  color: #856404;
}

.patient-status.completed {
  background: #d4edda;
  color: #155724;
}

.patient-status.in-progress {
  background: #cce7ff;
  color: #004085;
}

/* Schedule */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.schedule-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-left: 4px solid #007bff;
  background: #f8f9fa;
  border-radius: 0 6px 6px 0;
}

.schedule-time {
  font-weight: 600;
  color: #007bff;
  min-width: 80px;
  margin-right: 15px;
}

.schedule-title {
  font-weight: 600;
  color: #343a40;
}

.schedule-patient {
  font-size: 14px;
  color: #6c757d;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
