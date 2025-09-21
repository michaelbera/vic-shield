import { useState } from 'react';
import { useContractStore } from '~/store/contractStore';
import type { ContractCategory } from '~/types/contract';

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  isLoading?: boolean;
}

const TemplateSelector = ({ onTemplateSelect, isLoading }: TemplateSelectorProps) => {
  const { templates } = useContractStore();
  const [selectedCategory, setSelectedCategory] = useState<ContractCategory | 'all'>('all');

  const categories = [
    { value: 'all', label: 'Tất cả', icon: '📄' },
    { value: 'real-estate', label: 'Bất động sản', icon: '🏠' },
    { value: 'rental', label: 'Thuê nhà', icon: '🏠' },
    { value: 'employment', label: 'Lao động', icon: '💼' },
    { value: 'service', label: 'Dịch vụ', icon: '🛠️' },
    { value: 'purchase', label: 'Mua bán', icon: '🛒' },
    { value: 'other', label: 'Khác', icon: '📋' },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const popularTemplates = filteredTemplates.filter(template => template.isPopular);
  const otherTemplates = filteredTemplates.filter(template => !template.isPopular);

  const getTemplateIcon = (category: ContractCategory) => {
    const icons = {
      'real-estate': '🏠',
      'rental': '🏠',
      'employment': '💼',
      'service': '🛠️',
      'purchase': '🛒',
      'partnership': '🤝',
      'other': '📋',
    };
    return icons[category] || '📄';
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category.value}
            className={`btn btn-sm ${
              selectedCategory === category.value 
                ? 'btn-primary' 
                : 'btn-ghost'
            }`}
            onClick={() => setSelectedCategory(category.value as any)}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Popular Templates */}
      {popularTemplates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            📈 Mẫu phổ biến
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map(template => (
              <div
                key={template.id}
                className="card bg-base-100 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => !isLoading && onTemplateSelect(template.id)}
              >
                <div className="card-body p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">
                      {getTemplateIcon(template.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="card-title text-base">
                        {template.name}
                        <div className="badge badge-primary badge-sm">Phổ biến</div>
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {template.fields.length} trường thông tin
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button 
                      className={`btn btn-primary btn-sm ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      Chọn mẫu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Templates */}
      {otherTemplates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            📋 Tất cả mẫu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherTemplates.map(template => (
              <div
                key={template.id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => !isLoading && onTemplateSelect(template.id)}
              >
                <div className="card-body p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">
                      {getTemplateIcon(template.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="card-title text-base">
                        {template.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {template.fields.length} trường thông tin
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button 
                      className={`btn btn-ghost btn-sm ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      Chọn mẫu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy mẫu nào</h3>
          <p className="text-gray-600">Thử chọn danh mục khác hoặc tạo hợp đồng trống</p>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;