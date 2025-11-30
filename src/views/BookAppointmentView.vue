<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Book Appointment</h1>
        <p class="lead">Select an available time slot to book your appointment</p>
        <div class="alert alert-info">
          <h6>Booking Constraints:</h6>
          <ul class="mb-0 small">
            <li><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM</li>
            <li><strong>Lunch Break:</strong> 12:00 PM - 1:00 PM (unavailable)</li>
            <li><strong>Duration:</strong> 30-minute appointments</li>
            <li><strong>Advance Booking:</strong> Maximum 30 days in advance</li>
            <li><strong>Conflict Management:</strong> No overlapping appointments allowed</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <p>Loading available appointments...</p>
            </div>
            <div v-else>
              <FullCalendar
                :options="calendarOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div class="modal fade" id="bookingModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Appointment Booking</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Date:</strong> {{ selectedSlot?.dateStr }}</p>
            <p><strong>Time:</strong> {{ selectedSlot?.timeStr }}</p>
            <p><strong>Duration:</strong> 30 minutes</p>
            <div class="mb-3">
              <label for="clinicSelect" class="form-label">Select Clinic</label>
              <select id="clinicSelect" class="form-select" v-model="selectedClinicId">
                <option value="1">Melbourne Community Health Centre</option>
                <option value="2">Richmond Family Clinic</option>
                <option value="3">Fitzroy Health Hub</option>
                <option value="4">St Kilda Community Clinic</option>
                <option value="5">Brunswick Medical Centre</option>
                <option value="6">Collingwood Family Health</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="appointmentNote" class="form-label">Reason for visit (optional)</label>
              <textarea 
                id="appointmentNote" 
                class="form-control" 
                v-model="appointmentNote"
                rows="3"
                placeholder="Brief description of your health concern or reason for the appointment"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="confirmBooking"
              :disabled="bookingInProgress"
            >
              {{ bookingInProgress ? 'Booking...' : 'Confirm Booking' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div class="modal fade" id="successModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Appointment Booked!</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
              <p>Your appointment has been successfully booked.</p>
              <p><strong>Date:</strong> {{ confirmedAppointment?.dateStr }}</p>
              <p><strong>Time:</strong> {{ confirmedAppointment?.timeStr }}</p>
              <p class="text-muted">You will receive a confirmation email shortly.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useUserStore } from '@/stores/user'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Modal } from 'bootstrap'

const userStore = useUserStore()

const loading = ref(true)
const selectedSlot = ref(null)
const selectedClinicId = ref('1')
const appointmentNote = ref('')
const bookingInProgress = ref(false)
const confirmedAppointment = ref(null)
const availableSlots = ref([])
const bookedSlots = ref([])

// Booking validation functions
const isTimeSlotAllowed = (start) => {
  const hour = start.getHours()
  const minute = start.getMinutes()
  const day = start.getDay()
  
  // Business hours constraint: 9 AM - 5 PM, Monday to Friday
  if (day === 0 || day === 6) return false // No weekends
  if (hour < 9 || hour >= 17) return false // Outside business hours
  
  // Lunch break constraint: 12:00 PM - 1:00 PM
  if (hour === 12) return false
  
  // Must be 30-minute aligned
  if (minute !== 0 && minute !== 30) return false
  
  // Cannot book in the past
  if (start < new Date()) return false
  
  // Cannot book more than 30 days in advance
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  if (start > maxDate) return false
  
  return true
}

const checkForConflicts = async (start, end) => {
  try {
    const conflictQuery = query(
      collection(db, 'appointments'),
      where('dateTime', '>=', start),
      where('dateTime', '<', end),
      where('status', '==', 'booked')
    )
    
    const snapshot = await getDocs(conflictQuery)
    return !snapshot.empty
  } catch (error) {
    console.warn('Cannot check conflicts - offline mode. Checking local slots.', error.message)
    // In offline mode, check against local bookedSlots for conflicts
    return bookedSlots.value.some(slot => {
      const slotStart = new Date(slot.start)
      const slotEnd = new Date(slot.end)
      // Check if new appointment overlaps with existing booking
      return (start < slotEnd && end > slotStart)
    })
  }
}

const handleTimeSelection = async (selectInfo) => {
  const { start, end } = selectInfo
  
  // Validate time slot constraints
  if (!isTimeSlotAllowed(start)) {
    alert('Invalid time selection. Please select a valid 30-minute slot during business hours (9 AM - 5 PM, weekdays only).')
    selectInfo.view.calendar.unselect()
    return
  }
  
  // Check for conflicts
  const hasConflict = await checkForConflicts(start, end)
  if (hasConflict) {
    alert('This time slot is already booked. Please select a different time.')
    selectInfo.view.calendar.unselect()
    return
  }
  
  // Proceed with booking
  selectedSlot.value = {
    id: `temp-${start.getTime()}`,
    start: start,
    end: end,
    dateStr: `${start.getDate().toString().padStart(2, '0')}/${(start.getMonth() + 1).toString().padStart(2, '0')}/${start.getFullYear()}`, // Australian DD/MM/YYYY format
    timeStr: start.toLocaleTimeString('en-AU', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  // Clear the calendar selection immediately (this causes the blue flash to end)
  selectInfo.view.calendar.unselect()
  
  // Show booking modal using the imported Modal class
  nextTick(() => {
    const modalEl = document.getElementById('bookingModal')
    if (modalEl) {
      // Check if a modal instance already exists to prevent duplicates
      let modal = Modal.getInstance(modalEl)
      if (!modal) {
        modal = new Modal(modalEl)
      }
      modal.show()
    }
  })
}

const handleSlotClick = (clickInfo) => {
  // Only allow clicking on available slots
  if (!clickInfo.event.extendedProps.isAvailable) return
  
  selectedSlot.value = {
    id: clickInfo.event.id,
    start: clickInfo.event.start,
    dateStr: clickInfo.event.extendedProps.dateStr,
    timeStr: clickInfo.event.extendedProps.timeStr
  }
  
  // Show booking modal
  nextTick(() => {
    const modalEl = document.getElementById('bookingModal')
    if (modalEl) {
      let modal = Modal.getInstance(modalEl)
      if (!modal) {
        modal = new Modal(modalEl)
      }
      modal.show()
    }
  })
}

// Calendar options will be defined after all functions are declared
const calendarOptions = ref({})

const generateAvailableSlots = () => {
  // We'll let users select time directly, no pre-generated slots
  return []
}

const loadBookedAppointments = async () => {
  try {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('status', '==', 'booked')
    )
    
    const snapshot = await getDocs(appointmentsQuery)
    const booked = []
    
    snapshot.forEach(doc => {
      const data = doc.data()
      const startDate = data.dateTime.toDate ? data.dateTime.toDate() : new Date(data.dateTime)
      
      booked.push({
        id: doc.id,
        title: 'Unavailable',
        start: startDate,
        end: new Date(startDate.getTime() + 30 * 60 * 1000), // 30 mins later
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
        display: 'block', // Shows as a blocking event
        overlap: false, // Prevents overlapping
        extendedProps: {
          isAvailable: false,
          isBooked: true
        }
      })
    })
    
    bookedSlots.value = booked
  } catch (error) {
    console.warn('Firestore connection failed. Running in offline mode with empty calendar.', error.message)
    bookedSlots.value = []
    // Show user-friendly message
    if (error.message && error.message.includes('CORS')) {
      console.warn('CORS issue detected. This is normal in development mode.')
    }
  }
}

const updateCalendarEvents = () => {
  // Create business hours constraint events
  const businessHoursEvents = generateBusinessHoursConstraints()
  
  // Show only booked appointments and constraints
  calendarOptions.value.events = [...bookedSlots.value, ...businessHoursEvents]
}

const generateBusinessHoursConstraints = () => {
  const constraints = []
  const today = new Date()
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  
  // Add lunch break constraints (12:00 PM - 1:00 PM)
  for (let d = new Date(today); d <= thirtyDaysFromNow; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue // Skip weekends
    
    const lunchStart = new Date(d)
    lunchStart.setHours(12, 0, 0, 0)
    const lunchEnd = new Date(d)
    lunchEnd.setHours(13, 0, 0, 0)
    
    constraints.push({
      id: `lunch-${d.toISOString().split('T')[0]}`,
      title: 'Lunch Break',
      start: lunchStart,
      end: lunchEnd,
      backgroundColor: '#ffc107',
      borderColor: '#ffc107',
      display: 'background',
      overlap: false,
      extendedProps: {
        isConstraint: true
      }
    })
  }
  
  return constraints
}

const confirmBooking = async () => {
  if (!selectedSlot.value || !userStore.currentUser) return
  
  bookingInProgress.value = true
  
  try {
    // Check for conflicts one more time
    const conflictQuery = query(
      collection(db, 'appointments'),
      where('dateTime', '==', selectedSlot.value.start),
      where('status', '==', 'booked')
    )
    
    const conflictSnapshot = await getDocs(conflictQuery)
    
    if (!conflictSnapshot.empty) {
      alert('This time slot has been taken by another user. Please select a different time.')
      return
    }
    
    // Save appointment to Firestore
    await addDoc(collection(db, 'appointments'), {
      userId: userStore.currentUser.uid,
      clinicId: parseInt(selectedClinicId.value),
      dateTime: selectedSlot.value.start,
      note: appointmentNote.value,
      status: 'booked',
      createdAt: new Date()
    })
    
    // Update calendar to show new booking
    await loadBookedAppointments()
    updateCalendarEvents()
    
    // Store confirmed appointment details for success modal
    confirmedAppointment.value = {
      ...selectedSlot.value,
      dateStr: `${selectedSlot.value.start.getDate().toString().padStart(2, '0')}/${(selectedSlot.value.start.getMonth() + 1).toString().padStart(2, '0')}/${selectedSlot.value.start.getFullYear()}`, // Australian DD/MM/YYYY format
      timeStr: selectedSlot.value.start.toLocaleTimeString('en-AU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
    
    // Hide booking modal
    const bookingModalEl = document.getElementById('bookingModal')
    const bookingModal = Modal.getInstance(bookingModalEl)
    if (bookingModal) {
      bookingModal.hide()
    }
    
    // Show success modal after a brief delay
    setTimeout(() => {
      const successModalEl = document.getElementById('successModal')
      if (successModalEl) {
        let successModal = Modal.getInstance(successModalEl)
        if (!successModal) {
          successModal = new Modal(successModalEl)
        }
        successModal.show()
      }
    }, 500)
    
    // Reset form
    appointmentNote.value = ''
    selectedClinicId.value = '1'
    selectedSlot.value = null
    
  } catch (error) {
    console.error('Error booking appointment:', error)
    alert('Failed to book appointment. Please try again.')
  } finally {
    bookingInProgress.value = false
  }
}

onMounted(async () => {
  try {
    // Set up calendar options with function references
    calendarOptions.value = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      },
      initialView: 'timeGridWeek',
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: false, // Constraint: No weekend bookings
      events: [],
      eventClick: handleSlotClick,
      select: handleTimeSelection,
      selectConstraint: 'businessHours',
      eventConstraint: 'businessHours',
      height: 600,
      slotMinTime: '09:00:00',
      slotMaxTime: '17:00:00',
      slotDuration: '00:30:00', // 30-minute slots
      snapDuration: '00:30:00', // Snap to 30-minute intervals
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday only
        startTime: '09:00',
        endTime: '17:00'
      },
      selectOverlap: false, // Prevent overlapping selections
      eventOverlap: false, // Prevent overlapping events
      selectAllow: (selectInfo) => {
        return isTimeSlotAllowed(selectInfo.start)
      },
      eventAllow: (_, draggedEvent) => {
        // Prevent moving booked appointments
        return draggedEvent.extendedProps?.isAvailable === true
      },
      validRange: {
        start: new Date(), // Cannot book in the past
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Max 30 days in advance
      }
    }
    
    // Set up slots and load existing appointments
    availableSlots.value = generateAvailableSlots()
    await loadBookedAppointments()
    updateCalendarEvents()
  } catch (error) {
    console.error('Error initializing calendar:', error)
    // Set up with empty state if connection fails
    bookedSlots.value = []
    updateCalendarEvents()
  } finally {
    loading.value = false
  }
})
</script>

<style>
/* FullCalendar custom styling */
.fc-event {
  cursor: pointer;
}

.fc-event-title {
  font-weight: 600;
}

.fc .fc-button-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.fc .fc-button-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.fc-event:hover {
  opacity: 0.8;
}

/* Constraint styling */
.fc-bgevent {
  opacity: 0.3;
}

.fc-non-business {
  background-color: #f8f9fa;
}

.fc-business-hours {
  background-color: #ffffff;
}

/* Available slot styling */
.fc-event[style*="rgb(40, 167, 69)"] {
  border: 2px solid #28a745 !important;
  color: white !important;
}

/* Booked slot styling */
.fc-event[style*="rgb(220, 53, 69)"] {
  border: 2px solid #dc3545 !important;
  color: white !important;
  cursor: not-allowed !important;
}

/* Lunch break styling */
.fc-event[style*="rgb(255, 193, 7)"] {
  border: 2px solid #ffc107 !important;
  color: #212529 !important;
  cursor: not-allowed !important;
}

/* Selection highlight */
.fc-highlight {
  background-color: rgba(0, 123, 255, 0.2) !important;
  border: 2px dashed #007bff !important;
}

/* Disable selection on non-business hours */
.fc-non-business .fc-timegrid-slot {
  background-color: #f8f9fa !important;
}
</style>