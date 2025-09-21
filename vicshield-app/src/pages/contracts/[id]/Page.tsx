import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from '~/components/UI/Container';
import { useContractStore } from '~/store/contractStore';
import type { Contract } from '~/types/contract';

const ContractDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContract, getTemplate, updateContract } = useContractStore();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

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
  }, [id, getContract, navigate]);

  const template = contract ? getTemplate(contract.templateId) : null;

  const handleSave = async () => {
    if (!contract) return;

    try {
      setIsSaving(true);
      
      updateContract(contract.id, {
        data: formData,
        title: formData.contract_title || contract.title,
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
      <span className={`badge ${badges[status as keyof typeof badges] || 'badge-ghost'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (!contract || !template) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="loading loading-spinner loading-lg"></div>
            <p>Đang tải hợp đồng...</p>
          </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><a onClick={() => updateContract(contract.id, { status: 'pending' })}>Gửi để ký</a></li>
                  <li><a onClick={() => updateContract(contract.id, { status: 'signed' })}>Đánh dấu đã ký</a></li>
                  <li><a>Xuất PDF</a></li>
                  <li><a>Chia sẻ</a></li>
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
                          {field.required && <span className="text-error ml-1">*</span>}
                        </span>
                      </div>
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          className="textarea textarea-bordered h-24"
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          disabled={!isEditing}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          className="select select-bordered"
                          value={formData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          disabled={!isEditing}
                        >
                          <option value="">Chọn...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="input input-bordered"
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                          disabled={!isEditing}
                        />
                      )}
                    </label>
                  </div>
                ))}
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
    </Container>
  );
};

export default ContractDetailsPage;