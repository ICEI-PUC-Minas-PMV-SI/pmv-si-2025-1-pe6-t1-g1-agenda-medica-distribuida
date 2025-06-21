import React, {useState, useContext, useEffect} from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import UserAvatar from '../components/UserAvatar'

const MyProfile = () => {

const { userData, getUserData, setUserData, backendUrl, token } = useContext(AppContext)
const [isEdit, setIsEdit] = useState(false)
const [editData, setEditData] = useState({})
const [isLoading, setIsLoading] = useState(false)
const [showPasswordModal, setShowPasswordModal] = useState(false)
const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const [passwordLoading, setPasswordLoading] = useState(false)

useEffect(() => {
    console.log('🔄 MyProfile montado, chamando getUserData');
    getUserData()
}, [])

useEffect(() => {
    console.log('👤 Dados do usuário atualizados:', userData);
    if (userData) {
        setEditData({
            name: userData.name || '',
            gender: userData.gender || '',
            birthdate: userData.birthdate ? formatDateForInput(userData.birthdate) : ''
        });
    }
}, [userData])

// Função para formatar a data para exibição
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para formatar a data para input (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Ajustar para timezone local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Função para formatar o gênero
const formatGender = (gender) => {
    if (!gender) return 'Não informado';
    const genderMap = {
        'Male': 'Masculino',
        'Female': 'Feminino',
        'Masculino': 'Masculino',
        'Feminino': 'Feminino'
    };
    return genderMap[gender] || gender;
}

// Função para salvar alterações
const handleSave = async () => {
    setIsLoading(true);
    try {
        // Preparar dados para salvar
        const dataToSave = {
            ...editData,
            // Garantir que a data seja salva no formato correto
            birthdate: editData.birthdate ? new Date(editData.birthdate + 'T00:00:00').toISOString() : null
        };
        
        // Atualizar dados localmente
        const updatedUserData = {
            ...userData,
            ...dataToSave
        };
        setUserData(updatedUserData);
        
        // Salvar no localStorage para persistir entre recarregamentos
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        setIsEdit(false);
        
        // Aqui você pode adicionar uma chamada para a API quando estiver disponível
        console.log('💾 Dados salvos:', updatedUserData);
        
        // Simular delay para feedback visual
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        setIsLoading(false);
    }
}

// Função para cancelar edição
const handleCancel = () => {
    setEditData({
        name: userData?.name || '',
        gender: userData?.gender || '',
        birthdate: userData?.birthdate ? formatDateForInput(userData.birthdate) : ''
    });
    setIsEdit(false);
}

// Função para alterar senha
const handleChangePassword = async () => {
    // Validações
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    if (passwordData.newPassword.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    setPasswordLoading(true);
    try {
        const response = await axios.patch(
            `${backendUrl}/api/auth/change-password`,
            {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            },
            {
                headers: {
                    "client": "not-browser",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        
        if (response.data.success) {
            alert('Senha alterada com sucesso!');
            setShowPasswordModal(false);
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            alert(response.data.message || 'Erro ao alterar senha');
        }
    } catch (error) {
        console.error('❌ Erro ao alterar senha:', error);
        alert(error.response?.data?.message || 'Erro ao alterar senha');
    } finally {
        setPasswordLoading(false);
    }
}

// Função para fechar modal de senha
const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
}

  return (
    <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header com foto e nome */}
            <div className="flex items-center space-x-6 mb-8">
                {userData?.userImage ? (
                    <img 
                        src={userData.userImage} 
                        alt="Foto do perfil" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                ) : (
                    <UserAvatar 
                        name={userData?.name} 
                        size="xl" 
                        className="border-4 border-gray-200"
                    />
                )}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {userData?.name || 'Carregando...'}
                    </h1>
                    <p className="text-gray-600">Perfil do usuário</p>
                </div>
            </div>

            <hr className="mb-8" />

            {/* Informações do usuário */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                            {userData?.email || 'Não informado'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome:</label>
                        {isEdit ? (
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData(prev => ({...prev, name: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Digite seu nome"
                            />
                        ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {userData?.name || 'Não informado'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gênero:</label>
                        {isEdit ? (
                            <select
                                value={editData.gender}
                                onChange={(e) => setEditData(prev => ({...prev, gender: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                                <option value="Prefiro não dizer">Prefiro não dizer</option>
                            </select>
                        ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {userData?.gender ? formatGender(userData.gender) : 'Não informado'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento:</label>
                        {isEdit ? (
                            <input
                                type="date"
                                value={editData.birthdate}
                                onChange={(e) => setEditData(prev => ({...prev, birthdate: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {userData?.birthdate ? formatDate(userData.birthdate) : 'Não informado'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status da Conta:</label>
                        <p className={`p-3 rounded-md ${userData?.verified ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                            {userData?.verified ? 'Verificada' : 'Não verificada'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuário:</label>
                        <p className={`p-3 rounded-md ${userData?.isAdmin ? 'bg-purple-50 text-purple-800' : 'bg-blue-50 text-blue-800'}`}>
                            {userData?.isAdmin ? 'Administrador' : 'Usuário'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Botões de ação */}
            <div className="mt-8 flex space-x-4">
                {isEdit ? (
                    <>
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                        
                        <button 
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => setIsEdit(true)} 
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Editar Perfil
                        </button>
                        
                        <button 
                            onClick={() => setShowPasswordModal(true)}
                            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                        >
                            Alterar Senha
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* Modal de Alteração de Senha */}
        {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <h3 className="text-xl font-semibold mb-6">Alterar Senha</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual:</label>
                            <input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, oldPassword: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha:</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Digite a nova senha"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha:</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirme a nova senha"
                            />
                        </div>
                    </div>
                    
                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={handleChangePassword}
                            disabled={passwordLoading}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                        
                        <button
                            onClick={handleClosePasswordModal}
                            disabled={passwordLoading}
                            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default MyProfile