import { useState, useEffect } from 'react';
import { useUserStore } from '~/store/userStore';
import type { ContractUser } from '~/types/contract';

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (users: ContractUser[]) => void;
  selectedUsers: ContractUser[];
  title: string;
  description?: string;
  multiple?: boolean;
  required?: boolean;
}

const UserSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedUsers,
  title,
  description,
  multiple = false,
  required = false,
}: UserSelectionModalProps) => {
  const { users, searchUsers } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [localSelectedUsers, setLocalSelectedUsers] = useState<ContractUser[]>(selectedUsers);

  useEffect(() => {
    setLocalSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    const filtered = searchUsers(searchQuery);
    setFilteredUsers(filtered);
  }, [searchQuery, searchUsers]);

  const handleUserToggle = (user: ContractUser) => {
    if (multiple) {
      const isSelected = localSelectedUsers.some(u => u.id === user.id);
      if (isSelected) {
        setLocalSelectedUsers(prev => prev.filter(u => u.id !== user.id));
      } else {
        setLocalSelectedUsers(prev => [...prev, user]);
      }
    } else {
      setLocalSelectedUsers([user]);
    }
  };

  const handleConfirm = () => {
    if (required && localSelectedUsers.length === 0) {
      return;
    }
    onSelect(localSelectedUsers);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedUsers(selectedUsers);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}

        {/* Search */}
        <div className="form-control mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, phòng ban..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto mb-4">
          <div className="space-y-2">
            {filteredUsers.map((user) => {
              const isSelected = localSelectedUsers.some(u => u.id === user.id);
              return (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserToggle(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={user.avatar} alt={user.name} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.department && user.position && (
                        <div className="text-xs text-gray-400">
                          {user.position} - {user.department}
                        </div>
                      )}
                    </div>
                    {multiple && (
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={isSelected}
                        onChange={() => {}} // Handled by onClick above
                      />
                    )}
                    {!multiple && isSelected && (
                      <div className="text-primary">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Count */}
        {multiple && (
          <div className="text-sm text-gray-600 mb-4">
            Đã chọn: {localSelectedUsers.length} người
          </div>
        )}

        {/* Actions */}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={handleCancel}>
            Hủy
          </button>
          <button
            className={`btn btn-primary ${required && localSelectedUsers.length === 0 ? 'btn-disabled' : ''}`}
            onClick={handleConfirm}
            disabled={required && localSelectedUsers.length === 0}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionModal;