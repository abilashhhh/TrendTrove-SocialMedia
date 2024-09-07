import React from "react";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: any[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, users }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-800 dark:text-white">X</button>
        </div>
        <div>
          {users.length > 0 ? (
            <ul>
              {users.map(user => (
                <li key={user._id} onClick={() => navigate(`/profiles/${user.username}`)} className="flex items-center cursor-pointer py-2 border-b border-gray-300">
                  <img src={user.dp} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-800 dark:text-white">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
