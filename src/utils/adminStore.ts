// Simple admin store for demo purposes
// In production, this would be handled by a backend API and authentication service

export interface AdminCredentials {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  role: 'Super Admin' | 'Admin';
  createdAt: string;
  lastLogin: string;
}

class AdminStore {
  private admins: AdminCredentials[] = [
    {
      id: '1',
      name: 'System',
      surname: 'Administrator',
      email: 'admin',
      phone: '+27123456789',
      password: 'admin123',
      role: 'Super Admin',
      createdAt: '2024-01-01',
      lastLogin: new Date().toISOString()
    }
  ];

  // Get all admins (without passwords for security)
  getAllAdmins() {
    return this.admins.map(admin => ({
      id: admin.id,
      name: admin.name,
      surname: admin.surname,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin
    }));
  }

  // Add new admin
  addAdmin(adminData: Omit<AdminCredentials, 'id' | 'createdAt' | 'lastLogin'>) {
    const newAdmin: AdminCredentials = {
      ...adminData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    
    this.admins.push(newAdmin);
    return newAdmin;
  }

  // Authenticate admin
  authenticate(username: string, password: string): AdminCredentials | null {
    const admin = this.admins.find(a => 
      (a.email === username || a.email.split('@')[0] === username) && 
      a.password === password
    );
    
    if (admin) {
      // Update last login
      admin.lastLogin = new Date().toISOString();
      return admin;
    }
    
    return null;
  }

  // Delete admin
  deleteAdmin(id: string): boolean {
    const index = this.admins.findIndex(a => a.id === id);
    if (index !== -1 && this.admins[index].role !== 'Super Admin') {
      this.admins.splice(index, 1);
      return true;
    }
    return false;
  }

  // Check if email exists
  emailExists(email: string): boolean {
    return this.admins.some(a => a.email === email);
  }
}

// Export singleton instance
export const adminStore = new AdminStore();
