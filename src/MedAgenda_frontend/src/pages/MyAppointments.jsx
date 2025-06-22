import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {

  const { appointments, doctors, cancelAppointment, userData } = useContext(AppContext)

  // Função para formatar data e hora
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return `Data não informada às ${timeStr || ''}`;
    let date;
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      date = new Date(`${year}-${month}-${day}`);
    } else {
      date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) return `Data inválida às ${timeStr || ''}`;
    const formattedDate = date.toLocaleDateString('pt-BR');
    return `${formattedDate} às ${timeStr}`;
  }

  // Função para encontrar informações do médico
  const getDoctorInfo = (appointment) => {
    // Se vier populado do backend como objeto
    if (appointment.doctor && typeof appointment.doctor === 'object' && !Array.isArray(appointment.doctor)) {
      return appointment.doctor;
    }
    // Se vier como array (schema antigo), pega o primeiro elemento
    if (Array.isArray(appointment.doctor) && appointment.doctor.length > 0) {
      const doctorId = appointment.doctor[0];
      return doctors.find(doc => doc._id === doctorId) || null;
    }
    // Se vier apenas o ID, tenta buscar na lista de médicos
    return doctors.find(doc => doc._id === appointment.doctor) || null;
  }

  // Função para cancelar agendamento
  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      await cancelAppointment(appointmentId);
    }
  }

  // Função para verificar se o médico existe
  const isDoctorValid = (appointment) => {
    const doctorInfo = getDoctorInfo(appointment);
    return doctorInfo && doctorInfo.name && doctorInfo.name !== 'Médico não encontrado';
  }

  // Função para obter o status do agendamento baseado no campo 'cancelled'
  const getAppointmentStatus = (appointment) => {
    if (appointment.cancelled) {
      return 'cancelled';
    }
    if (appointment.isCompleted) {
      return 'completed';
    }
    return 'scheduled';
  }

  // Função para obter o label do status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'cancelled':
        return 'Cancelado';
      case 'completed':
        return 'Realizado';
      case 'scheduled':
      default:
        return 'Agendado';
    }
  }

  // Função para obter a classe CSS do status
  const getStatusClass = (status) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  // Filtrar agendamentos válidos (com médicos existentes)
  const validAppointments = appointments.filter(isDoctorValid);

  // DEBUG: Exibir no console os dados recebidos
  console.log('appointments:', appointments);
  console.log('doctors:', doctors);
  console.log(`Agendamentos filtrados: ${appointments.length - validAppointments.length} removidos, ${validAppointments.length} válidos restantes`);

  // Carregar agendamentos quando a página for montada
  useEffect(() => {
    // Os agendamentos já são carregados automaticamente pelo contexto
  }, []);

  if (!userData) {
    return (
      <div>
        <div className="mt-12 text-center">
          <p className="text-gray-600">Você precisa estar logado para ver seus agendamentos.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-600 border-b border-zinc-300 border-b-[1px]'>Meus Agendamentos</p>
      
      {validAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {appointments.length === 0 ? 
              "Você ainda não possui agendamentos." : 
              "Todos os seus agendamentos foram removidos pois os médicos foram deletados."
            }
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {appointments.length === 0 ? 
              "Marque sua primeira consulta!" : 
              "Marque uma nova consulta com médicos disponíveis!"
            }
          </p>
        </div>
      ) : (
        <div>
          {validAppointments.map((appointment, index) => {
            const doctorInfo = getDoctorInfo(appointment);
            const status = getAppointmentStatus(appointment);
            
            // DEBUG: Log específico para cada agendamento
            console.log(`Agendamento ${index + 1}:`, {
              appointmentId: appointment._id,
              doctorField: appointment.doctor,
              doctorInfo: doctorInfo,
              cancelled: appointment.cancelled,
              status: status
            });
            
            return (
              <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-zinc-200 border-b-[1px]' key={appointment._id || index}>
                <div>
                  <img 
                    className='w-32 h-32 object-cover rounded-4xl bg-indigo-50' 
                    src={doctorInfo?.image || doctorInfo?.doctorImage || '/placeholder-doctor.jpg'} 
                    alt=""
                    onError={(e) => {
                      e.target.src = '/placeholder-doctor.jpg';
                    }}
                  />
                </div>
                <div className='flex-1 text-sm text-zinc-600'>
                  <p className='text-neutral-800 font-semibold text-lg'>
                    {doctorInfo?.name || 'Médico não encontrado'}
                  </p>
                  <p className='text-gray-600'>{doctorInfo?.speciality || 'Especialidade não informada'}</p>
                  <p className='text-xs mt-2'>
                    <span className='text-sm text-neutral-700 font-medium'>Data e Horário: </span> 
                    {formatDateTime(appointment.slotDate, appointment.slotTime)}
                  </p>
                  <p className='text-xs mt-1'>
                    <span className='text-sm text-neutral-700 font-medium'>Status: </span> 
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                  </p>
                </div>
                <div className='flex flex-col justify-end py-1.5'>
                  {!appointment.cancelled && (
                    <button 
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className='text-sm text-red-600 text-center sm:min-w-48 py-2 border border-red-300 rounded hover:bg-red-50 transition-all duration-300 cursor-pointer'
                    >
                      Cancelar Agendamento
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default MyAppointments