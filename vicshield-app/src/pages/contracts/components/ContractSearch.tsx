import { useState } from 'react';
import { useContractStore } from '~/store/contractStore';

const ContractSearch = () => {
  const { setSearchFilters, searchFilters } = useContractStore();
  const [query, setQuery] = useState(searchFilters.query || '');

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setSearchFilters({ ...searchFilters, query: searchQuery });
  };

  const clearSearch = () => {
    setQuery('');
    setSearchFilters({ ...searchFilters, query: undefined });
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="form-control flex-1">
            <div className="input-group">
              <input
                type="text"
                placeholder="Tìm kiếm hợp đồng theo tên hoặc loại..."
                className="input input-bordered w-full"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {query && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={clearSearch}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Quick Filter Options */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-sm font-medium text-gray-600">Lọc nhanh:</span>
          {[
            { label: 'Tất cả', value: undefined },
            { label: 'Bản nháp', value: 'draft' },
            { label: 'Chờ ký', value: 'pending' },
            { label: 'Đã ký', value: 'signed' },
          ].map((filter) => (
            <button
              key={filter.label}
              className={`btn btn-xs ${
                searchFilters.status === filter.value 
                  ? 'btn-primary' 
                  : 'btn-ghost'
              }`}
              onClick={() => setSearchFilters({ 
                ...searchFilters, 
                status: filter.value as any 
              })}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractSearch;