import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContractStore } from '~/store/contractStore';
import type { ContractUser, ContractTemplate } from '~/types/contract';
import ContractEditor from '~/components/contract/ContractEditor';
import FileUpload from '~/components/contract/FileUpload';
import UserSelectionModal from '~/components/modals/UserSelectionModal';
import ContractSummaryModal from '~/components/modals/ContractSummaryModal';

interface CreateContractFormProps {
  template: ContractTemplate;
  onBack: () => void;
}

const CreateContractForm = ({ template, onBack }: CreateContractFormProps) => {
  const navigate = useNavigate();
  const { createContract, updateContract, getContract } = useContractStore();

  // Form state
  const [title, setTitle] = useState(`${template.name} - ${new Date().toLocaleDateString('vi-VN')}`);
  const [content, setContent] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [signers, setSigners] = useState<ContractUser[]>([]);
  const [reviewers, setReviewers] = useState<ContractUser[]>([]);
  const [viewers, setViewers] = useState<ContractUser[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Modal states
  const [showSignerModal, setShowSignerModal] = useState(false);
  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [createdContractId, setCreatedContractId] = useState<string | null>(null);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Initialize form data with default values
    const initialData: Record<string, any> = {};
    template.fields.forEach(field => {
      if (field.type === 'date') {
        initialData[field.id] = today;
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
  }, [template, today]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileContent = (fileContent: string, fileName: string) => {
    setContent(fileContent);
    // Show a toast or notification that file was loaded
    console.log(`Loaded content from ${fileName}`);
  };

  const validateForm = () => {
    // Check required template fields
    for (const field of template.fields) {
      if (field.required && !formData[field.id]) {
        alert(`Vui lòng điền ${field.label}`);
        return false;
      }
    }

    // Check title
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề hợp đồng');
      return false;
    }

    // Check signers (required)
    if (signers.length === 0) {
      alert('Vui lòng chọn ít nhất một người ký');
      return false;
    }

    // Check expiration date
    if (expirationDate && new Date(expirationDate) <= new Date()) {
      alert('Ngày hết hạn phải sau ngày hôm nay');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    
    try {
      // Simulate loading for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create the contract
      const contractId = createContract(template.id, title);
      
      // Update contract with additional data
      updateContract(contractId, {
        data: formData,
        content,
        signers,
        reviewers,
        viewers,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      });

      setCreatedContractId(contractId);
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Có lỗi xảy ra khi tạo hợp đồng');
    } finally {
      setIsCreating(false);
    }
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
            placeholder={field.placeholder}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="input input-bordered w-full"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
            placeholder={field.placeholder}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className="input input-bordered w-full"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            min={today}
          />
        );
      case 'select':
        return (
          <select
            className="select select-bordered w-full"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
            placeholder={field.placeholder}
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
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={onEdit}
        >
          {users.length > 0 ? 'Sửa' : 'Chọn'}
        </button>
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

  // Show loading screen
  if (isCreating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <h2 className="text-2xl font-semibold">Đang tạo hợp đồng...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <p className="text-gray-600">{template.description}</p>
        </div>
        <button className="btn btn-ghost" onClick={onBack}>
          ← Quay lại
        </button>
      </div>

      {/* Contract Title */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Thông tin cơ bản</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Tiêu đề hợp đồng <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề hợp đồng"
            />
          </div>
        </div>
      </div>

      {/* Template Fields */}
      {template.fields.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Thông tin hợp đồng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {template.fields.map((field) => (
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
          <h2 className="card-title">Nội dung hợp đồng</h2>
          
          {/* File Upload */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text font-medium">Tải lên từ file</span>
            </label>
            <FileUpload onFileContent={handleFileContent} />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Hoặc soạn thảo trực tiếp</span>
            </label>
            <ContractEditor
              initialContent={content}
              onChange={setContent}
              placeholder="Nhập nội dung hợp đồng..."
            />
          </div>
        </div>
      </div>

      {/* People & Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Người liên quan & Cài đặt</h2>
          
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
                  <span className="label-text font-medium">Ngày hết hạn (tùy chọn)</span>
                </div>
                <input
                  type="date"
                  className="input input-bordered"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={today}
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
      <div className="flex justify-center gap-4 pb-8">
        <button className="btn btn-ghost btn-lg" onClick={onBack}>
          Hủy
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Đang tạo...
            </>
          ) : (
            'Hoàn thành'
          )}
        </button>
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

      {createdContractId && (
        <ContractSummaryModal
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          contract={getContract(createdContractId)!}
          onNavigateToContract={(id) => navigate(`/contracts/${id}`)}
        />
      )}
    </div>
  );
};

export default CreateContractForm;