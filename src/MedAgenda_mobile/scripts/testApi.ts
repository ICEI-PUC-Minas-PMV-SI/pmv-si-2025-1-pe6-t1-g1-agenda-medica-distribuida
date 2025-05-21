import { authService, doctorService, appointmentService, profileService } from '../services/api';

async function testApi() {
  try {
    console.log('🚀 Starting API tests...\n');

    // 1. Test Registration
    console.log('📝 Testing Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@medagenda.com',
      password: 'Test123',
      gender: 'male',
      birthdate: '1990-01-01'
    };
    const registeredUser = await authService.register(registerData);
    console.log('✅ Registration successful:', registeredUser);

    // 2. Test Login
    console.log('\n🔑 Testing Login...');
    const loginResponse = await authService.login('test@medagenda.com', 'Test123');
    console.log('✅ Login successful:', loginResponse);

    // 3. Test Profile Access
    console.log('\n👤 Testing Profile Access...');
    const profile = await profileService.getProfile();
    console.log('✅ Profile retrieved:', profile);

    // 4. Test Doctor Listing
    console.log('\n👨‍⚕️ Testing Doctor Listing...');
    const doctors = await doctorService.getDoctors();
    console.log('✅ Doctors retrieved:', doctors);

    // 5. Test Doctor Specialties
    console.log('\n🏥 Testing Doctor Specialties...');
    const specialties = await doctorService.getDoctorSpecialties();
    console.log('✅ Specialties retrieved:', specialties);

    // 6. Test Appointment Creation (if we have a doctor)
    if (doctors.length > 0) {
      console.log('\n📅 Testing Appointment Creation...');
      const appointmentData = {
        userId: profile._id,
        docId: doctors[0]._id,
        slotDate: '2024-03-20',
        slotTime: '10:00'
      };
      const appointment = await appointmentService.createAppointment(appointmentData);
      console.log('✅ Appointment created:', appointment);

      // 7. Test Appointment Listing
      console.log('\n📋 Testing Appointment Listing...');
      const appointments = await appointmentService.getAppointments();
      console.log('✅ Appointments retrieved:', appointments);
    }

    console.log('\n✨ All tests completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testApi(); 