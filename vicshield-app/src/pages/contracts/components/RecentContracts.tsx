import { useContractStore } from '~/store/contractStore';

interface RecentContractsProps {
  onContractSelect: (contractId: string) => void;
  limit?: number;
}

const RecentContracts = ({ onContractSelect, limit = 6 }: RecentContractsProps) => {
  const { getRecentContracts } = useContractStore();
  const recentContracts = getRecentContracts(limit);

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'badge-ghost',
      pending: 'badge-warning',
      signed: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-error',
    };
    
    const labels = {
      draft: 'Bản nháp',
      pending: 'Chờ ký',
      signed: 'Đã ký',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };

    return (
      <span className={`badge ${badges[status as keyof typeof badges] || 'badge-ghost'} badge-sm`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: '📝',
      pending: '⏳',
      signed: '✅',
      completed: '🎉',
      cancelled: '❌',
    };
    return icons[status as keyof typeof icons] || '📄';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hôm nay';
    } else if (diffInDays === 1) {
      return 'Hôm qua';
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (recentContracts.length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">Chưa có hợp đồng nào</h3>
          <p className="text-gray-600">Tạo hợp đồng đầu tiên của bạn bằng cách chọn mẫu ở trên</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentContracts.map(contract => (
            <div
              key={contract.id}
              className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer border"
              onClick={() => onContractSelect(contract.id)}
            >
              <div className="card-body p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getStatusIcon(contract.status)}
                    </span>
                    <h3 className="card-title text-sm font-medium line-clamp-1">
                      {contract.title}
                    </h3>
                  </div>
                  {getStatusBadge(contract.status)}
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Loại:</span>
                    <span className="font-medium">{contract.templateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cập nhật:</span>
                    <span>{formatDate(contract.updatedAt)}</span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-xs">
                    Mở →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentContracts.length >= limit && (
          <div className="text-center mt-6">
            <button className="btn btn-ghost btn-sm">
              Xem tất cả hợp đồng →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentContracts;