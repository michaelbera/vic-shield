import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Contract, ContractTemplate, ContractSearchFilters } from '~/types/contract';

interface ContractStore {
  // Templates
  templates: ContractTemplate[];
  
  // Contracts
  contracts: Contract[];
  
  // Search
  searchFilters: ContractSearchFilters;
  
  // Actions
  setSearchFilters: (filters: ContractSearchFilters) => void;
  createContract: (templateId: string, title: string) => string;
  updateContract: (id: string, data: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  getContract: (id: string) => Contract | undefined;
  getRecentContracts: (limit?: number) => Contract[];
  searchContracts: () => Contract[];
  
  // Template actions
  getTemplate: (id: string) => ContractTemplate | undefined;
  getTemplatesByCategory: (category?: string) => ContractTemplate[];
}

// Mock contract templates
const mockTemplates: ContractTemplate[] = [
  {
    id: 'house-sale',
    name: 'Hợp đồng mua bán nhà',
    description: 'Hợp đồng mua bán bất động sản nhà ở',
    category: 'real-estate',
    isPopular: true,
    fields: [
      { id: 'buyer_name', label: 'Tên người mua', type: 'text', required: true },
      { id: 'seller_name', label: 'Tên người bán', type: 'text', required: true },
      { id: 'property_address', label: 'Địa chỉ nhà', type: 'textarea', required: true },
      { id: 'price', label: 'Giá bán', type: 'number', required: true },
      { id: 'payment_method', label: 'Phương thức thanh toán', type: 'select', required: true, options: ['Tiền mặt', 'Chuyển khoản', 'Vay ngân hàng'] },
      { id: 'handover_date', label: 'Ngày bàn giao', type: 'date', required: true },
    ],
  },
  {
    id: 'rental',
    name: 'Hợp đồng thuê trọ',
    description: 'Hợp đồng thuê phòng trọ, căn hộ',
    category: 'rental',
    isPopular: true,
    fields: [
      { id: 'tenant_name', label: 'Tên người thuê', type: 'text', required: true },
      { id: 'landlord_name', label: 'Tên chủ nhà', type: 'text', required: true },
      { id: 'property_address', label: 'Địa chỉ nhà thuê', type: 'textarea', required: true },
      { id: 'monthly_rent', label: 'Tiền thuê hàng tháng', type: 'number', required: true },
      { id: 'deposit', label: 'Tiền đặt cọc', type: 'number', required: true },
      { id: 'lease_duration', label: 'Thời hạn thuê (tháng)', type: 'number', required: true },
      { id: 'start_date', label: 'Ngày bắt đầu', type: 'date', required: true },
    ],
  },
  {
    id: 'employment',
    name: 'Hợp đồng lao động',
    description: 'Hợp đồng làm việc giữa công ty và nhân viên',
    category: 'employment',
    isPopular: true,
    fields: [
      { id: 'employee_name', label: 'Tên nhân viên', type: 'text', required: true },
      { id: 'company_name', label: 'Tên công ty', type: 'text', required: true },
      { id: 'position', label: 'Vị trí công việc', type: 'text', required: true },
      { id: 'salary', label: 'Mức lương', type: 'number', required: true },
      { id: 'contract_type', label: 'Loại hợp đồng', type: 'select', required: true, options: ['Thử việc', 'Có thời hạn', 'Không thời hạn'] },
      { id: 'start_date', label: 'Ngày bắt đầu', type: 'date', required: true },
    ],
  },
  {
    id: 'service',
    name: 'Hợp đồng dịch vụ',
    description: 'Hợp đồng cung cấp dịch vụ',
    category: 'service',
    fields: [
      { id: 'service_provider', label: 'Người cung cấp dịch vụ', type: 'text', required: true },
      { id: 'client_name', label: 'Tên khách hàng', type: 'text', required: true },
      { id: 'service_description', label: 'Mô tả dịch vụ', type: 'textarea', required: true },
      { id: 'service_fee', label: 'Phí dịch vụ', type: 'number', required: true },
      { id: 'completion_date', label: 'Ngày hoàn thành', type: 'date', required: true },
    ],
  },
  {
    id: 'purchase',
    name: 'Hợp đồng mua bán hàng hóa',
    description: 'Hợp đồng mua bán sản phẩm, hàng hóa',
    category: 'purchase',
    fields: [
      { id: 'buyer_name', label: 'Tên người mua', type: 'text', required: true },
      { id: 'seller_name', label: 'Tên người bán', type: 'text', required: true },
      { id: 'product_description', label: 'Mô tả sản phẩm', type: 'textarea', required: true },
      { id: 'quantity', label: 'Số lượng', type: 'number', required: true },
      { id: 'unit_price', label: 'Đơn giá', type: 'number', required: true },
      { id: 'delivery_date', label: 'Ngày giao hàng', type: 'date', required: true },
    ],
  },
  {
    id: 'blank',
    name: 'Hợp đồng trống',
    description: 'Tạo hợp đồng mới từ đầu',
    category: 'other',
    fields: [
      { id: 'contract_title', label: 'Tiêu đề hợp đồng', type: 'text', required: true },
      { id: 'party_a', label: 'Bên A', type: 'text', required: true },
      { id: 'party_b', label: 'Bên B', type: 'text', required: true },
      { id: 'content', label: 'Nội dung hợp đồng', type: 'textarea', required: true },
    ],
  },
];

// Mock contracts data
const mockContracts: Contract[] = [
  {
    id: '1',
    templateId: 'house-sale',
    templateName: 'Hợp đồng mua bán nhà',
    title: 'Mua bán nhà 123 Nguyễn Trãi',
    data: {
      buyer_name: 'Nguyễn Văn A',
      seller_name: 'Trần Thị B',
      property_address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
      price: 5000000000,
    },
    status: 'draft',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    templateId: 'rental',
    templateName: 'Hợp đồng thuê trọ',
    title: 'Thuê phòng tại Q7',
    data: {
      tenant_name: 'Lê Văn C',
      landlord_name: 'Phạm Thị D',
      property_address: '456 Nguyễn Hữu Thọ, Quận 7, TP.HCM',
      monthly_rent: 8000000,
    },
    status: 'signed',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    templateId: 'employment',
    templateName: 'Hợp đồng lao động',
    title: 'HĐ lao động - Developer',
    data: {
      employee_name: 'Hoàng Văn E',
      company_name: 'VicShield Co.',
      position: 'Frontend Developer',
      salary: 25000000,
    },
    status: 'pending',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08'),
  },
];

export const useContractStore = create<ContractStore>()(
  persist(
    (set, get) => ({
      templates: mockTemplates,
      contracts: mockContracts,
      searchFilters: {},

      setSearchFilters: (filters) => set({ searchFilters: filters }),

      createContract: (templateId, title) => {
        const template = get().templates.find(t => t.id === templateId);
        if (!template) throw new Error('Template not found');
        
        const newContract: Contract = {
          id: Date.now().toString(),
          templateId,
          templateName: template.name,
          title,
          data: {},
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          contracts: [newContract, ...state.contracts]
        }));

        return newContract.id;
      },

      updateContract: (id, data) => {
        set(state => ({
          contracts: state.contracts.map(contract =>
            contract.id === id
              ? { ...contract, ...data, updatedAt: new Date() }
              : contract
          )
        }));
      },

      deleteContract: (id) => {
        set(state => ({
          contracts: state.contracts.filter(contract => contract.id !== id)
        }));
      },

      getContract: (id) => {
        return get().contracts.find(contract => contract.id === id);
      },

      getRecentContracts: (limit = 5) => {
        return get().contracts
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .slice(0, limit);
      },

      searchContracts: () => {
        const { contracts, searchFilters } = get();
        let filtered = [...contracts];

        if (searchFilters.query) {
          const query = searchFilters.query.toLowerCase();
          filtered = filtered.filter(contract =>
            contract.title.toLowerCase().includes(query) ||
            contract.templateName.toLowerCase().includes(query)
          );
        }

        if (searchFilters.status) {
          filtered = filtered.filter(contract => contract.status === searchFilters.status);
        }

        if (searchFilters.category) {
          filtered = filtered.filter(contract => {
            const template = get().templates.find(t => t.id === contract.templateId);
            return template?.category === searchFilters.category;
          });
        }

        return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      },

      getTemplate: (id) => {
        return get().templates.find(template => template.id === id);
      },

      getTemplatesByCategory: (category) => {
        const templates = get().templates;
        if (!category) return templates;
        return templates.filter(template => template.category === category);
      },
    }),
    {
      name: 'contract-store',
      partialize: (state) => ({ 
        contracts: state.contracts,
        searchFilters: state.searchFilters 
      }),
    }
  )
);