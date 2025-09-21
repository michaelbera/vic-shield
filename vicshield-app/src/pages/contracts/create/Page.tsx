import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '~/components/UI/Container';
import { useContractStore } from '~/store/contractStore';
import type { ContractTemplate } from '~/types/contract';
import ContractSearch from '../components/ContractSearch';
import TemplateSelector from '../components/TemplateSelector';
import RecentContracts from '../components/RecentContracts';
import CreateContractForm from './CreateContractForm';

const CreateContractPage = () => {
  const navigate = useNavigate();
  const { getTemplate } = useContractStore();
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleTemplateSelect = async (templateId: string) => {
    try {
      setIsCreating(true);
      const template = getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      
      setSelectedTemplate(template);
    } catch (error) {
      console.error('Error selecting template:', error);
      // You could add toast notification here
    } finally {
      setIsCreating(false);
    }
  };

  const handleExistingContractSelect = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleBackToSelection = () => {
    setSelectedTemplate(null);
  };

  // If template is selected, show the contract form
  if (selectedTemplate) {
    return (
      <Container>
        <div className="min-h-screen py-8 px-4 md:px-6">
          <CreateContractForm
            template={selectedTemplate}
            onBack={handleBackToSelection}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Tạo hợp đồng mới
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chọn mẫu hợp đồng phù hợp hoặc tiếp tục chỉnh sửa hợp đồng đã có
            </p>
          </div>

          {/* Search Section */}
          <div className="w-full">
            <ContractSearch />
          </div>

          {/* Template Selection Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Chọn mẫu hợp đồng
              </h2>
              <p className="text-gray-600">
                Bắt đầu với một trong những mẫu phổ biến hoặc tạo hợp đồng trống
              </p>
            </div>
            
            <TemplateSelector 
              onTemplateSelect={handleTemplateSelect}
              isLoading={isCreating}
            />
          </div>

          {/* Recent Contracts Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Hợp đồng gần đây
              </h2>
              <p className="text-gray-600">
                Tiếp tục chỉnh sửa các hợp đồng đã tạo trước đó
              </p>
            </div>
            
            <RecentContracts 
              onContractSelect={handleExistingContractSelect}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateContractPage;