import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from '~/components/UI/Container';
import { useContractStore } from '~/store/contractStore';
import type { Contract, ContractUser } from '~/types/contract';
import ContractEditor from '~/components/contract/ContractEditor';
import UserSelectionModal from '~/components/modals/UserSelectionModal';

const ContractDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContract, getTemplate, updateContract } = useContractStore();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [content, setContent] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [signers, setSigners] = useState<ContractUser[]>([]);
  const [reviewers, setReviewers] = useState<ContractUser[]>([]);
  const [viewers, setViewers] = useState<ContractUser[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal states
  const [showSignerModal, setShowSignerModal] = useState(false);
  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!id) {
      navigate('/contracts/create');
      return;
    }

    const foundContract = getContract(id);
    if (!foundContract) {
      navigate('/contracts/create');
      return;
    }

    setContract(foundContract);
    setFormData(foundContract.data);
    setContent(foundContract.content || '');
    setExpirationDate(foundContract.expirationDate ? foundContract.expirationDate.toISOString().split('T')[0] : '');
    setSigners(foundContract.signers || []);
    setReviewers(foundContract.reviewers || []);
    setViewers(foundContract.viewers || []);
  }, [id, getContract, navigate]);

  const template = contract ? getTemplate(contract.templateId) : null;

  const handleSave = async () => {
    if (!contract) return;

    try {
      setIsSaving(true);
      
      updateContract(contract.id, {
        data: formData,
        content,
        title: formData.contract_title || contract.title,
        signers,
        reviewers,
        viewers,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      });

      // Update local state
      const updatedContract = getContract(contract.id);
      if (updatedContract) {
        setContract(updatedContract);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving contract:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
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

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={!isEditing}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="input input-bordered w-full"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
            disabled={!isEditing}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className="input input-bordered w-full"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={!isEditing}
            min={isEditing ? today : undefined}
          />
        );
      case 'select':
        return (
          <select
            className="select select-bordered w-full"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Chọn {field.label.toLowerCase()}</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            className="textarea textarea-bordered w-full h-24"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={!isEditing}
          />
        );
      default:
        return null;
    }
  };

  const renderUserList = (users: ContractUser[], title: string, onEdit: () => void, required = false) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="label-text font-medium">
          {title} {required && <span className="text-error">*</span>}
        </label>
        {isEditing && (
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onEdit}
          >
            {users.length > 0 ? 'Sửa' : 'Chọn'}
          </button>
        )}
      </div>
      {users.length > 0 ? (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
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
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          {required ? 'Bắt buộc chọn người ký' : 'Chưa chọn'}
        </div>
      )}
    </div>
  );

  if (!contract || !template) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="breadcrumbs text-sm">
              <ul>
                <li><Link to="/contracts/create">Hợp đồng</Link></li>
                <li className="font-medium">{contract.title}</li>
              </ul>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(contract.status)}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a>Sao chép liên kết</a></li>
                  <li><a>Tải xuống PDF</a></li>
                  <li><a className="text-error">Xóa hợp đồng</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contract Info Card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="card-title text-2xl mb-2">{contract.title}</h1>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Tạo: {contract.createdAt.toLocaleDateString('vi-VN')}</span>
                    <span>Cập nhật: {contract.updatedAt.toLocaleDateString('vi-VN')}</span>
                    {contract.expirationDate && (
                      <span className="text-warning">
                        Hết hạn: {contract.expirationDate.toLocaleDateString('vi-VN')}
                      </span>
                    )}
                    <span>Loại: {template.name}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button 
                        className="btn btn-ghost" 
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(contract.data);
                          setContent(contract.content || '');
                          setExpirationDate(contract.expirationDate ? contract.expirationDate.toISOString().split('T')[0] : '');
                          setSigners(contract.signers || []);
                          setReviewers(contract.reviewers || []);
                          setViewers(contract.viewers || []);
                        }}
                        disabled={isSaving}
                      >
                        Hủy
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? <span className="loading loading-spinner loading-sm"></span> : 'Lưu'}
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setIsEditing(true)}
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contract Form */}
          {template.fields.length > 0 && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-6">Thông tin hợp đồng</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {template.fields.map(field => (
                    <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text font-medium">
                            {field.label}
                            {field.required && <span className="text-error">*</span>}
                          </span>
                        </div>
                        {renderField(field)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contract Content */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-6">Nội dung hợp đồng</h2>
              
              {isEditing ? (
                <ContractEditor
                  initialContent={content}
                  onChange={setContent}
                  placeholder="Nhập nội dung hợp đồng..."
                />
              ) : (
                <div className="prose max-w-none">
                  {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  ) : (
                    <p className="text-gray-500 italic">Chưa có nội dung</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* People & Settings */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-6">Người liên quan & Cài đặt</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Signers */}
                <div className="md:col-span-2">
                  {renderUserList(signers, 'Người ký', () => setShowSignerModal(true), true)}
                </div>

                {/* Reviewers */}
                <div>
                  {renderUserList(reviewers, 'Người duyệt', () => setShowReviewerModal(true))}
                </div>

                {/* Viewers */}
                <div>
                  {renderUserList(viewers, 'Người xem', () => setShowViewerModal(true))}
                </div>

                {/* Expiration Date */}
                <div className="md:col-span-2">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-medium">Ngày hết hạn</span>
                    </div>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      disabled={!isEditing}
                      min={isEditing ? today : undefined}
                    />
                    <div className="label">
                      <span className="label-text-alt text-gray-500">
                        Các bên phải ký trước ngày này
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Link to="/contracts/create" className="btn btn-ghost">
              ← Quay lại
            </Link>
            {contract.status === 'draft' && (
              <button 
                className="btn btn-primary"
                onClick={() => updateContract(contract.id, { status: 'pending' })}
              >
                Gửi để ký
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserSelectionModal
        isOpen={showSignerModal}
        onClose={() => setShowSignerModal(false)}
        onSelect={setSigners}
        selectedUsers={signers}
        title="Chọn người ký"
        description="Chọn những người cần ký vào hợp đồng này"
        multiple={true}
        required={true}
      />

      <UserSelectionModal
        isOpen={showReviewerModal}
        onClose={() => setShowReviewerModal(false)}
        onSelect={setReviewers}
        selectedUsers={reviewers}
        title="Chọn người duyệt"
        description="Chọn những người sẽ duyệt hợp đồng trước khi gửi ký"
        multiple={true}
      />

      <UserSelectionModal
        isOpen={showViewerModal}
        onClose={() => setShowViewerModal(false)}
        onSelect={setViewers}
        selectedUsers={viewers}
        title="Chọn người xem"
        description="Chọn những người được xem hợp đồng sau khi ký"
        multiple={true}
      />
    </Container>
  );
};

export default ContractDetailsPage;