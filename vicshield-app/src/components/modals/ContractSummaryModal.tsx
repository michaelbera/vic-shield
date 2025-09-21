import type { Contract, ContractUser } from '~/types/contract';

interface ContractSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  onNavigateToContract: (contractId: string) => void;
}

const ContractSummaryModal = ({
  isOpen,
  onClose,
  contract,
  onNavigateToContract,
}: ContractSummaryModalProps) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { class: 'badge-ghost', text: 'Bản nháp' },
      pending: { class: 'badge-warning', text: 'Chờ ký' },
      signed: { class: 'badge-success', text: 'Đã ký' },
      completed: { class: 'badge-info', text: 'Hoàn thành' },
      cancelled: { class: 'badge-error', text: 'Đã hủy' },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const renderUserList = (users: ContractUser[], title: string, emptyText: string) => (
    <div>
      <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
      {users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img src={user.avatar} alt={user.name} />
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">{emptyText}</p>
      )}
    </div>
  );

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-green-600">✅ Tạo hợp đồng thành công!</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Contract Basic Info */}
          <div className="card bg-base-100 border">
            <div className="card-body">
              <h4 className="card-title text-lg">{contract.title}</h4>
              <p className="text-gray-600">{contract.templateName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                  <div className="mt-1">{getStatusBadge(contract.status)}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                  <div className="mt-1 text-sm">{formatDate(contract.createdAt)}</div>
                </div>
                {contract.expirationDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Ngày hết hạn:</span>
                    <div className="mt-1 text-sm text-warning">
                      {formatDate(contract.expirationDate)}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Mã hợp đồng:</span>
                  <div className="mt-1 text-sm font-mono">{contract.id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* People Involved */}
          <div className="card bg-base-100 border">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4">Người liên quan</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderUserList(
                  contract.signers,
                  '👤 Người ký',
                  'Chưa có người ký'
                )}
                
                {renderUserList(
                  contract.reviewers,
                  '🔍 Người duyệt',
                  'Không có người duyệt'
                )}
                
                {renderUserList(
                  contract.viewers,
                  '👁️ Người xem',
                  'Không có người xem'
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="alert alert-info">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium">Bước tiếp theo</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Bạn có thể tiếp tục chỉnh sửa nội dung hợp đồng</li>
                  <li>• Thêm hoặc xóa người ký, người duyệt, người xem</li>
                  <li>• Gửi hợp đồng để các bên liên quan ký kết</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onNavigateToContract(contract.id);
              onClose();
            }}
          >
            Chỉnh sửa hợp đồng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractSummaryModal;