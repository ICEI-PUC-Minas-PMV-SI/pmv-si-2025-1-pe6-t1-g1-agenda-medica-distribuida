import React from 'react';

const UserAvatar = ({ name, size = 'md', className = '' }) => {
    // Função para gerar cor baseada no nome
    const getColorFromName = (name) => {
        if (!name) return '#6B7280'; // Cor padrão cinza
        
        const colors = [
            '#EF4444', // Vermelho
            '#F59E0B', // Amarelo
            '#10B981', // Verde
            '#3B82F6', // Azul
            '#8B5CF6', // Roxo
            '#EC4899', // Rosa
            '#F97316', // Laranja
            '#06B6D4', // Ciano
            '#84CC16', // Verde lima
            '#6366F1', // Índigo
        ];
        
        // Gerar um número baseado no nome
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Usar o hash para selecionar uma cor
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    // Função para obter a inicial do nome
    const getInitials = (name) => {
        if (!name) return '?';
        
        const names = name.trim().split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        } else {
            return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
        }
    };

    // Definir tamanhos
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
        '2xl': 'w-32 h-32 text-4xl'
    };

    const backgroundColor = getColorFromName(name);
    const initials = getInitials(name);

    return (
        <div
            className={`${sizeClasses[size]} ${className} rounded-full flex items-center justify-center font-bold text-white shadow-md`}
            style={{ backgroundColor }}
            title={name || 'Usuário'}
        >
            {initials}
        </div>
    );
};

export default UserAvatar; 