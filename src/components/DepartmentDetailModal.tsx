import React from 'react';
import { X, MapPin, Phone, Mail, Globe, Users, BookOpen, Building } from 'lucide-react';
import { Department } from '../types';

interface DepartmentDetailModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  department,
  isOpen,
  onClose
}) => {
  if (!isOpen || !department) return null;

  const getDepartmentIcon = (departmentId: string) => {
    switch (departmentId) {
      case 'cs': return Users;
      case 'cse': return Globe;
      case 'informatics': return BookOpen;
      case 'it': return Building;
      default: return Users;
    }
  };

  const IconComponent = getDepartmentIcon(department.id);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-in zoom-in-95 duration-300 mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <IconComponent className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{department.name}</h2>
                <p className="text-gray-600 mt-1">Soshanguve South Campus</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Department Codes */}
          {department.codes && department.codes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Department Codes</h3>
              <div className="flex flex-wrap gap-2">
                {department.codes.map((code, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {department.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">{department.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Contact Information</h3>
            
            {/* Building */}
            {department.building && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-600">{department.building}</p>
                </div>
              </div>
            )}

            {/* Contact Number */}
            {department.contact && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <a
                    href={`tel:${department.contact}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {department.contact}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {department.email && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <a
                    href={`mailto:${department.email}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {department.email}
                  </a>
                </div>
              </div>
            )}

            {/* Website */}
            {department.website && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Website</p>
                  <a
                    href={department.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {department.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Soshanguve South Campus</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">ICT Faculty</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailModal;