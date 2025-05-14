import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants/theme';

const menuItems = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: 'user',
    route: '/profile/personal',
  },
  {
    id: 'medical',
    title: 'Medical History',
    icon: 'heartbeat',
    route: '/profile/medical',
  },
  {
    id: 'insurance',
    title: 'Insurance Details',
    icon: 'id-card',
    route: '/profile/insurance',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    route: '/profile/notifications',
  },
  {
    id: 'security',
    title: 'Security',
    icon: 'lock',
    route: '/profile/security',
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'question-circle',
    route: '/profile/help',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={require('../../assets/images/profile-placeholder.png')}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'john.doe@example.com'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <FontAwesome name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Appointments</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Doctors</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.menuItemLeft}>
              <FontAwesome name={item.icon} size={20} color={COLORS.textSecondary} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <FontAwesome name="angle-right" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding.large,
    paddingTop: 60,
    backgroundColor: COLORS.background,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius.full,
  },
  userInfo: {
    flex: 1,
    marginLeft: SIZES.padding.large,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.title,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  editButton: {
    padding: SIZES.padding.small,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    margin: SIZES.padding.large,
    padding: SIZES.padding.large,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.title,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  menuContainer: {
    paddingHorizontal: SIZES.padding.large,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginLeft: SIZES.padding.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 50,
    padding: SIZES.padding.medium,
    marginHorizontal: SIZES.padding.large,
    borderRadius: SIZES.radius.medium,
    backgroundColor: '#FFF2F2',
  },
  logoutText: {
    marginLeft: SIZES.padding.small,
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.error,
  },
}); 