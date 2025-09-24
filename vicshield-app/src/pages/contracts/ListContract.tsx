import { useState } from "react";
import { FileText, File, FileSpreadsheet, FileImage, Calendar, User, Clock, Eye, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import type { Contract, ContractStatus } from "~/types/contract";

// Extended Contract type for the list display
interface ContractListItem extends Contract {
  img?: string;
  type: "doc" | "pdf" | "xlsx" | "image" | "txt";
  priority: "high" | "medium" | "low";
  progressPercentage: number;
  lastActivity: string;
  thumbnailUrl?: string;
}

const mockContracts: ContractListItem[] = [
  {
    id: "1",
    templateId: "real-estate-1",
    templateName: "Hợp đồng mua bán nhà đất",
    title: "Hợp đồng mua bán Villa Thảo Điền",
    status: "signed" as ContractStatus,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    expirationDate: new Date("2024-06-01"),
    data: {},
    signers: [
      { id: "1", name: "Nguyễn Văn A", email: "a.nguyen@example.com", position: "Người mua" },
      { id: "2", name: "Trần Thị B", email: "b.tran@example.com", position: "Người bán" }
    ],
    reviewers: [
      { id: "7", name: "Ngô Thị Lan", email: "lan.ngo@vicshield.com", department: "Pháp chế", position: "Luật sư trưởng" }
    ],
    viewers: [],
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=150&fit=crop",
    type: "pdf",
    priority: "high",
    progressPercentage: 100,
    lastActivity: "Đã ký hoàn tất 2 ngày trước"
  },
  {
    id: "2",
    templateId: "employment-1",
    templateName: "Hợp đồng lao động",
    title: "Hợp đồng lao động - Senior Developer",
    status: "pending" as ContractStatus,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-22"),
    expirationDate: new Date("2024-03-01"),
    data: {},
    signers: [
      { id: "3", name: "Lê Văn C", email: "c.le@example.com", position: "Ứng viên" },
      { id: "4", name: "Phạm Thị D", email: "d.pham@vicshield.com", position: "HR Manager" }
    ],
    reviewers: [
      { id: "5", name: "Võ Thị Hương", email: "huong.vo@vicshield.com", department: "Nhân sự", position: "Trưởng phòng nhân sự" }
    ],
    viewers: [],
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
    type: "doc",
    priority: "high",
    progressPercentage: 75,
    lastActivity: "Chờ ký từ HR Manager"
  },
  {
    id: "3",
    templateId: "service-1",
    templateName: "Hợp đồng cung cấp dịch vụ",
    title: "Hợp đồng phát triển ứng dụng Mobile",
    status: "draft" as ContractStatus,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-21"),
    data: {},
    signers: [],
    reviewers: [],
    viewers: [
      { id: "6", name: "Hoàng Văn E", email: "e.hoang@example.com", position: "Project Manager" }
    ],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop",
    type: "doc",
    priority: "medium",
    progressPercentage: 25,
    lastActivity: "Đang soạn thảo"
  },
  {
    id: "4",
    templateId: "partnership-1",
    templateName: "Hợp đồng hợp tác kinh doanh",
    title: "Thỏa thuận hợp tác chiến lược VicShield",
    status: "signed" as ContractStatus,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
    expirationDate: new Date("2025-01-10"),
    data: {},
    signers: [
      { id: "8", name: "CEO VicShield", email: "ceo@vicshield.com", position: "Giám đốc điều hành" },
      { id: "9", name: "CEO Partner Corp", email: "ceo@partner.com", position: "Đối tác" }
    ],
    reviewers: [
      { id: "7", name: "Ngô Thị Lan", email: "lan.ngo@vicshield.com", department: "Pháp chế", position: "Luật sư trưởng" }
    ],
    viewers: [],
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=150&fit=crop",
    type: "pdf",
    priority: "high",
    progressPercentage: 100,
    lastActivity: "Hoạt động 5 ngày trước"
  },
  {
    id: "5",
    templateId: "rental-1",
    templateName: "Hợp đồng cho thuê",
    title: "Hợp đồng thuê văn phòng Q1",
    status: "pending" as ContractStatus,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-23"),
    expirationDate: new Date("2024-04-01"),
    data: {},
    signers: [
      { id: "10", name: "VicShield Ltd", email: "legal@vicshield.com", position: "Bên thuê" },
      { id: "11", name: "Saigon Office", email: "lease@saigonoffice.com", position: "Bên cho thuê" }
    ],
    reviewers: [],
    viewers: [],
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop",
    type: "doc",
    priority: "medium",
    progressPercentage: 60,
    lastActivity: "Chờ phản hồi từ bên cho thuê"
  },
  {
    id: "6",
    templateId: "purchase-1",
    templateName: "Hợp đồng mua bán hàng hóa",
    title: "Hợp đồng mua thiết bị IT",
    status: "completed" as ContractStatus,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
    data: {},
    signers: [
      { id: "12", name: "VicShield Procurement", email: "procurement@vicshield.com", position: "Bên mua" },
      { id: "13", name: "TechSupply Co", email: "sales@techsupply.com", position: "Bên bán" }
    ],
    reviewers: [],
    viewers: [],
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop",
    type: "xlsx",
    priority: "low",
    progressPercentage: 100,
    lastActivity: "Hoàn thành 12 ngày trước"
  }
];

// Helper functions
const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-8 h-8 text-red-500" />;
    case "doc":
      return <File className="w-8 h-8 text-blue-500" />;
    case "xlsx":
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    case "image":
      return <FileImage className="w-8 h-8 text-purple-500" />;
    default:
      return <FileText className="w-8 h-8 text-gray-500" />;
  }
};

const getStatusBadge = (status: ContractStatus) => {
  switch (status) {
    case "draft":
      return <div className="badge badge-ghost gap-1"><AlertCircle className="w-3 h-3" /> Bản nháp</div>;
    case "pending":
      return <div className="badge badge-warning gap-1"><Clock className="w-3 h-3" /> Chờ ký</div>;
    case "signed":
      return <div className="badge badge-success gap-1"><CheckCircle className="w-3 h-3" /> Đã ký</div>;
    case "completed":
      return <div className="badge badge-info gap-1"><CheckCircle className="w-3 h-3" /> Hoàn thành</div>;
    case "cancelled":
      return <div className="badge badge-error gap-1"><XCircle className="w-3 h-3" /> Đã hủy</div>;
    default:
      return <div className="badge badge-ghost">{status}</div>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <div className="badge badge-error badge-sm">Cao</div>;
    case "medium":
      return <div className="badge badge-warning badge-sm">Trung bình</div>;
    case "low":
      return <div className="badge badge-success badge-sm">Thấp</div>;
    default:
      return null;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export default function ContractsList() {
  const [contracts] = useState<ContractListItem[]>(mockContracts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<ContractStatus | 'all'>('all');

  const filteredContracts = contracts.filter(contract => 
    filterStatus === 'all' || contract.status === filterStatus
  );

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Danh sách hợp đồng</h2>
        <p className="text-base-content/60">Quản lý và theo dõi các hợp đồng của bạn</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <select 
          className="select select-bordered select-sm w-40"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ContractStatus | 'all')}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="draft">Bản nháp</option>
          <option value="pending">Chờ ký</option>
          <option value="signed">Đã ký</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        
        <div className="join">
          <button 
            className={`btn btn-sm join-item ${viewMode === 'grid' ? 'btn-active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </button>
          <button 
            className={`btn btn-sm join-item ${viewMode === 'list' ? 'btn-active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <div className="w-4 h-4 flex flex-col gap-0.5">
              <div className="h-0.5 bg-current rounded"></div>
              <div className="h-0.5 bg-current rounded"></div>
              <div className="h-0.5 bg-current rounded"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {filteredContracts.map((contract) => (
        <div key={contract.id} className="card card-compact bg-base-100 shadow hover:shadow-lg transition-all cursor-pointer">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <div className="w-16 h-12 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {contract.thumbnailUrl ? (
                    <img src={contract.thumbnailUrl} alt={contract.title} className="w-full h-full object-cover" />
                  ) : (
                    getFileIcon(contract.type)
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{contract.title}</h3>
                    <p className="text-sm text-base-content/60 truncate">{contract.templateName}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getStatusBadge(contract.status)}
                      {getPriorityBadge(contract.priority)}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm text-base-content/60">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(contract.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {contract.signers.length} người ký
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-base-content/60">Tiến độ</span>
                    <span className="font-medium">{contract.progressPercentage}%</span>
                  </div>
                  <progress 
                    className={`progress w-full h-2 ${
                      contract.progressPercentage === 100 ? 'progress-success' : 
                      contract.progressPercentage >= 50 ? 'progress-warning' : 'progress-error'
                    }`} 
                    value={contract.progressPercentage} 
                    max="100"
                  ></progress>
                  <p className="text-xs text-base-content/60 mt-1">{contract.lastActivity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredContracts.map((contract) => (
        <div
          key={contract.id}
          className="card card-compact bg-base-100 shadow hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          {/* Card Image/Thumbnail */}
          <figure className="relative h-48 bg-base-200 overflow-hidden">
            {contract.img ? (
              <img 
                src={contract.img} 
                alt={contract.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
                {getFileIcon(contract.type)}
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
            )}
            
            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {getPriorityBadge(contract.priority)}
            </div>
            
            <div className="absolute top-3 right-3">
              <div className="tooltip" data-tip={`${contract.signers.length} người ký, ${contract.viewers.length} người xem`}>
                <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                  <Eye className="w-3 h-3" />
                  <span>{contract.signers.length + contract.viewers.length}</span>
                </div>
              </div>
            </div>

            {/* Progress overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="flex justify-between items-center text-white text-xs mb-1">
                <span>Tiến độ</span>
                <span className="font-medium">{contract.progressPercentage}%</span>
              </div>
              <progress 
                className={`progress progress-primary w-full h-1`} 
                value={contract.progressPercentage} 
                max="100"
              ></progress>
            </div>
          </figure>
          
          {/* Card Body */}
          <div className="card-body p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="card-title text-sm leading-tight line-clamp-2" title={contract.title}>
                {contract.title}
              </h3>
              {getFileIcon(contract.type)}
            </div>
            
            <p className="text-xs text-base-content/60 mb-3 line-clamp-1">{contract.templateName}</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <Calendar className="w-3 h-3" />
                <span>Tạo: {formatDate(contract.createdAt)}</span>
              </div>
              
              {contract.expirationDate && (
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <Clock className="w-3 h-3" />
                  <span>Hết hạn: {formatDate(contract.expirationDate)}</span>
                </div>
              )}
            </div>
            
            <div className="card-actions justify-between items-center mt-3">
              {getStatusBadge(contract.status)}
              <div className="flex items-center gap-1 text-xs text-base-content/60">
                <User className="w-3 h-3" />
                <span>{contract.signers.length}</span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-xs text-base-content/50 line-clamp-1">{contract.lastActivity}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="flex flex-col items-center gap-4">
        <FileText className="w-16 h-16 text-base-content/30" />
        <div>
          <h3 className="text-lg font-medium mb-1">Không tìm thấy hợp đồng</h3>
          <p className="text-base-content/60">Thử thay đổi bộ lọc hoặc tạo hợp đồng mới</p>
        </div>
        <button className="btn btn-primary">Tạo hợp đồng mới</button>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {renderHeader()}
      {filteredContracts.length === 0 ? renderEmptyState() : (
        viewMode === 'list' ? renderListView() : renderGridView()
      )}
    </div>
  );
}
