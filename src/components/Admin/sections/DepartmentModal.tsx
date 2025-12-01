
import React, { useState, useEffect, useCallback } from 'react';
import { Department, Campus } from '../../../types';
import { X, Save, Trash2, AlertCircle } from 'lucide-react';

interface DepartmentModalProps {
  department?: Department | null;
  campuses: Campus[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: Partial<Department>) => Promise<void>;
  onDelete?: (departmentId: string) => Promise<void>;
  mode: 'create' | 'edit';
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  department,
  campuses,
  isOpen,
  onClose,
  onSave,
  onDelete,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    department_code: '',
    description: '',
    building_number: '',
    email: '',
    contact_number: '',
    website_link: '',
    is_active: true,
    campus_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  // Enhanced campuses data debugging
  useEffect(() => {
    if (isOpen) {
      console.group('🏫 CAMPUSES DATA DEBUG - DepartmentModal');
      console.log('📋 Raw campuses prop:', campuses);
      console.log('🔢 Total campuses received:', campuses?.length || 0);
      
      if (!campuses || campuses.length === 0) {
        console.warn('❌ NO CAMPUSES DATA RECEIVED!');
      } else {
        // Check each campus individually with more detailed info
        campuses.forEach((campus, index) => {
          console.log(`📍 Campus ${index + 1}:`, {
            id: campus.campus_id,
            name: campus.campus_name,
            slug: campus.campus_slug,
            is_active: campus.is_active,
            has_id: !!campus.campus_id,
            id_type: typeof campus.campus_id,
            id_value: campus.campus_id
          });
        });

        // Specifically look for Polokwane with multiple search patterns
        const polokwaneCampus = campuses.find(c => {
          const name = c.campus_name?.toLowerCase() || '';
          const slug = c.campus_slug?.toLowerCase() || '';
          return name.includes('polokwane') || 
                 slug.includes('polokwane') ||
                 name === 'polokwane' ||
                 name === 'Polokwane';
        });

        console.log('🔎 Polokwane campus search result:', polokwaneCampus);
        
        // Check active campuses
        const activeCampuses = campuses.filter(campus => campus.is_active !== false);
        console.log('✅ Active campuses:', activeCampuses.length);
        console.log('📝 Active campuses names:', activeCampuses.map(c => c.campus_name));
        
        // Check for any potential data issues
        const campusesWithIssues = campuses.filter(campus => 
          !campus.campus_id || !campus.campus_name
        );
        if (campusesWithIssues.length > 0) {
          console.warn('🚨 Campuses with data issues:', campusesWithIssues);
        }
      }
      console.groupEnd();
    }
  }, [isOpen, campuses]);

  // Enhanced form initialization with better campus handling
  const initializeForm = useCallback(() => {
    console.group('🔄 FORM INITIALIZATION DEBUG');
    console.log('Initializing with:', { 
      department, 
      mode, 
      totalCampuses: campuses?.length || 0 
    });

    // Filter only active campuses and ensure they have valid IDs
    const activeCampuses = (campuses || []).filter(campus => {
      const isActive = campus.is_active !== false;
      const hasValidId = campus.campus_id != null && campus.campus_id !== '';
      const hasName = campus.campus_name && campus.campus_name.trim() !== '';
      
      return isActive && hasValidId && hasName;
    });

    console.log('✅ Valid active campuses for dropdown:', activeCampuses.map(c => ({
      id: c.campus_id,
      name: c.campus_name,
      active: c.is_active
    })));

    if (department && mode === 'edit') {
      console.log('📝 Edit mode - department campus_id:', department.campus_id);
      
      // Try to find the department's campus in active campuses first
      const departmentCampus = activeCampuses.find(c => 
        c.campus_id?.toString() === department.campus_id?.toString()
      );
      
      const campusId = departmentCampus ? 
        departmentCampus.campus_id.toString() : 
        (activeCampuses[0]?.campus_id?.toString() || '');

      console.log('🎯 Final campus ID for edit:', campusId);
      
      setFormData({
        name: department.name || '',
        department_code: department.department_code || '',
        description: department.description || '',
        building_number: department.building_number || '',
        email: department.email || '',
        contact_number: department.contact_number || '',
        website_link: department.website_link || '',
        is_active: department.is_active !== undefined ? department.is_active : true,
        campus_id: campusId
      });
    } else {
      // Create mode - set default campus from active campuses
      const defaultCampusId = activeCampuses.length > 0 ? 
        activeCampuses[0].campus_id.toString() : '';

      console.log('🆕 Create mode - default campus ID:', defaultCampusId);
      
      setFormData({
        name: '',
        department_code: '',
        description: '',
        building_number: '',
        email: '',
        contact_number: '',
        website_link: '',
        is_active: true,
        campus_id: defaultCampusId
      });
    }
    
    setError('');
    setIsSubmitting(false);
    setHasInitialized(true);
    console.groupEnd();
  }, [department, mode, campuses]);

  // Reset form when modal opens or mode changes significantly
  useEffect(() => {
    if (isOpen && campuses && campuses.length > 0 && !hasInitialized) {
      initializeForm();
    }
  }, [isOpen, hasInitialized, initializeForm, campuses]);

  // Reset initialization state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen]);

  // Input change handler
  const handleInputChange = (field: string, value: string | boolean) => {
    console.log(`📝 Updating ${field}:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Prevent modal close when clicking inside modal content
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    console.log('🚀 Form submitted with data:', formData);
    
    setIsSubmitting(true);
    setError('');

    // Enhanced validation
    if (!formData.name.trim()) {
      setError('Department name is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.department_code.trim()) {
      setError('Department code is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.campus_id) {
      setError('Please select a campus');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        department_code: formData.department_code.trim(),
        description: formData.description.trim(),
        building_number: formData.building_number.trim(),
        email: formData.email.trim(),
        contact_number: formData.contact_number.trim(),
        website_link: formData.website_link.trim(),
        is_active: formData.is_active,
        campus_id: parseInt(formData.campus_id)
      };
      
      console.log('📤 Final submit data:', submitData);
      
      await onSave(submitData);
      console.log('✅ Save successful');
      
    } catch (err: any) {
      console.error('❌ Save failed:', err);
      setError(err?.message || 'Failed to save department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!department || !onDelete) return;

    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      setIsSubmitting(true);
      try {
        await onDelete(department.id);
      } catch (err: any) {
        console.error('❌ Delete failed:', err);
        setError(err?.message || 'Failed to delete department');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  // Get active campuses for dropdown with enhanced filtering
  const activeCampuses = (campuses || []).filter(campus => {
    const isActive = campus.is_active !== false;
    const hasValidId = campus.campus_id != null && campus.campus_id !== '';
    const hasName = campus.campus_name && campus.campus_name.trim() !== '';
    
    return isActive && hasValidId && hasName;
  });

  // Sort campuses by name for better UX
  const sortedCampuses = [...activeCampuses].sort((a, b) => 
    (a.campus_name || '').localeCompare(b.campus_name || '')
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Department' : 'Edit Department'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Debug Info */}
        <div className="mx-6 mt-4 p-3 rounded-md bg-blue-50 text-blue-800 text-sm border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Campus Information</span>
          </div>
          <div className="text-xs space-y-1">
            <p>• Active campuses available: {sortedCampuses.length}</p>
            <p>• Total campuses received: {campuses?.length || 0}</p>
            <p>• Selected campus ID: {formData.campus_id}</p>
            <p>• Polokwane in list: {campuses?.some(c => 
              c.campus_name?.toLowerCase().includes('polokwane')) ? 'Yes' : 'No'}</p>
            {sortedCampuses.length > 0 && (
              <p>• Available: {sortedCampuses.map(c => c.campus_name).join(', ')}</p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department Name */}
            <div className="md:col-span-2">
              <label htmlFor="department-name" className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <input
                id="department-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter department name"
                disabled={isSubmitting}
              />
            </div>

            {/* Department Code */}
            <div>
              <label htmlFor="department-code" className="block text-sm font-medium text-gray-700 mb-2">
                Department Code *
              </label>
              <input
                id="department-code"
                type="text"
                required
                value={formData.department_code}
                onChange={(e) => handleInputChange('department_code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CS, MATH"
                disabled={isSubmitting}
              />
            </div>

            {/* Campus Dropdown - ENHANCED */}
            <div>
              <label htmlFor="campus-select" className="block text-sm font-medium text-gray-700 mb-2">
                Campus *
              </label>
              <select
                id="campus-select"
                required
                value={formData.campus_id}
                onChange={(e) => {
                  console.log('🎯 Campus selected:', e.target.value);
                  handleInputChange('campus_id', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting || sortedCampuses.length === 0}
              >
                <option value="">{sortedCampuses.length === 0 ? 'No campuses available' : 'Select Campus'}</option>
                {sortedCampuses.map(campus => (
                  <option 
                    key={campus.campus_id} 
                    value={campus.campus_id.toString()}
                  >
                    {campus.campus_name}
                  </option>
                ))}
              </select>
              
              {sortedCampuses.length === 0 ? (
                <p className="text-red-500 text-xs mt-1">
                  No active campuses available. Please check campus data.
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  {sortedCampuses.length} campus(es) available
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="department-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="department-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="department@university.edu"
                disabled={isSubmitting}
              />
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                id="contact-number"
                type="tel"
                value={formData.contact_number}
                onChange={(e) => handleInputChange('contact_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
              />
            </div>

            {/* Building Number */}
            <div>
              <label htmlFor="building-number" className="block text-sm font-medium text-gray-700 mb-2">
                Building Number
              </label>
              <input
                id="building-number"
                type="text"
                value={formData.building_number}
                onChange={(e) => handleInputChange('building_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Building 5"
                disabled={isSubmitting}
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2">
              <label htmlFor="website-link" className="block text-sm font-medium text-gray-700 mb-2">
                Website Link
              </label>
              <input
                id="website-link"
                type="url"
                value={formData.website_link}
                onChange={(e) => handleInputChange('website_link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://department.university.edu"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="department-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="department-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter department description..."
                disabled={isSubmitting}
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">Active Department</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {mode === 'edit' && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Department
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || sortedCampuses.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Department' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;