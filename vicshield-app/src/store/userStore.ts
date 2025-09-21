import { create } from 'zustand';
import type { ContractUser } from '~/types/contract';

interface UserStore {
  users: ContractUser[];
  searchUsers: (query: string) => ContractUser[];
  getUserById: (id: string) => ContractUser | undefined;
}

// Mock users data
const mockUsers: ContractUser[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@vicshield.com',
    avatar: 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=AN',
    department: 'Pháp chế',
    position: 'Chuyên viên pháp lý'
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@vicshield.com',
    avatar: 'https://via.placeholder.com/40/059669/FFFFFF?text=BT',
    department: 'Kinh doanh',
    position: 'Trưởng phòng kinh doanh'
  },
  {
    id: '3',
    name: 'Lê Hoàng Cường',
    email: 'cuong.le@vicshield.com',
    avatar: 'https://via.placeholder.com/40/DC2626/FFFFFF?text=LC',
    department: 'Kỹ thuật',
    position: 'Trưởng phòng kỹ thuật'
  },
  {
    id: '4',
    name: 'Phạm Minh Đức',
    email: 'duc.pham@vicshield.com',
    avatar: 'https://via.placeholder.com/40/7C3AED/FFFFFF?text=PD',
    department: 'Tài chính',
    position: 'Kế toán trưởng'
  },
  {
    id: '5',
    name: 'Võ Thị Hương',
    email: 'huong.vo@vicshield.com',
    avatar: 'https://via.placeholder.com/40/EC4899/FFFFFF?text=VH',
    department: 'Nhân sự',
    position: 'Trưởng phòng nhân sự'
  },
  {
    id: '6',
    name: 'Hoàng Văn Khôi',
    email: 'khoi.hoang@vicshield.com',
    avatar: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=HK',
    department: 'Marketing',
    position: 'Chuyên viên marketing'
  },
  {
    id: '7',
    name: 'Ngô Thị Lan',
    email: 'lan.ngo@vicshield.com',
    avatar: 'https://via.placeholder.com/40/10B981/FFFFFF?text=NL',
    department: 'Pháp chế',
    position: 'Luật sư trưởng'
  },
  {
    id: '8',
    name: 'Đặng Minh Nam',
    email: 'nam.dang@vicshield.com',
    avatar: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=DN',
    department: 'Kinh doanh',
    position: 'Chuyên viên kinh doanh'
  },
  {
    id: '9',
    name: 'Bùi Thị Oanh',
    email: 'oanh.bui@vicshield.com',
    avatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=BO',
    department: 'Vận hành',
    position: 'Trưởng phòng vận hành'
  },
  {
    id: '10',
    name: 'Trần Văn Phúc',
    email: 'phuc.tran@vicshield.com',
    avatar: 'https://via.placeholder.com/40/EF4444/FFFFFF?text=TP',
    department: 'CNTT',
    position: 'Trưởng phòng CNTT'
  }
];

export const useUserStore = create<UserStore>()(() => ({
  users: mockUsers,
  
  searchUsers: (query: string) => {
    if (!query.trim()) return mockUsers;
    
    const lowercaseQuery = query.toLowerCase();
    return mockUsers.filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.department?.toLowerCase().includes(lowercaseQuery) ||
      user.position?.toLowerCase().includes(lowercaseQuery)
    );
  },

  getUserById: (id: string) => {
    return mockUsers.find(user => user.id === id);
  }
}));