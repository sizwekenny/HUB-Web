
import { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Building, Mail, Phone, MapPin, 
  BookOpen, Users, RefreshCw, AlertCircle, Plus, Edit, Trash2, X, Save,
  User, Clock, Calendar, Link, GraduationCap
} from 'lucide-react';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Simple toast hook
const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const ToastComponent = () => {
    if (!toast) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={`p-4 rounded-lg shadow-lg border ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      </div>
    );
  };

  return { showToast, ToastComponent };
};

// Updated Department Modal Component with multiple campus support
const DepartmentModal = ({ 
  department, 
  campuses, 
  allDepartments, // NEW: All unique departments
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    department_id: '', // For existing department selection
    name: '', // For new department
    department_code: '',
    description: '',
    building_number: '',
    email: '',
    contact_number: '',
    website_link: '',
    is_active: true,
    campus_ids: [] // CHANGED: Now supports multiple campuses
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('🏫 DepartmentModal received data:', { 
        department, 
        campuses, 
        allDepartments,
        mode 
      });
      
      if (department && mode === 'edit') {
        // Edit mode - prefill with department data
        setFormData({
          department_id: department.id.toString(),
          name: department.name || '',
          department_code: department.department_code || '',
          description: department.description || '',
          building_number: department.building_number || '',
          email: department.email || '',
          contact_number: department.contact_number || '',
          website_link: department.website_link || '',
          is_active: department.is_active !== undefined ? department.is_active : true,
          campus_ids: department.campus_ids || [] // Array of campus IDs
        });
        setIsCreatingNew(false);
      } else {
        // Create mode - initialize empty
        setFormData({
          department_id: allDepartments[0]?.id?.toString() || '',
          name: '',
          department_code: '',
          description: '',
          building_number: '',
          email: '',
          contact_number: '',
          website_link: '',
          is_active: true,
          campus_ids: campuses.length > 0 ? [campuses[0].campus_id.toString()] : []
        });
        setIsCreatingNew(false);
      }
      setError('');
    }
  }, [isOpen, department, mode, campuses, allDepartments]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCampusToggle = (campusId) => {
    const campusIdStr = campusId.toString();
    setFormData(prev => ({
      ...prev,
      campus_ids: prev.campus_ids.includes(campusIdStr)
        ? prev.campus_ids.filter(id => id !== campusIdStr)
        : [...prev.campus_ids, campusIdStr]
    }));
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    // Validation
    if (isCreatingNew) {
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
    } else {
      if (!formData.department_id) {
        setError('Please select a department');
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.campus_ids.length === 0) {
      setError('Please select at least one campus');
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
        campus_ids: formData.campus_ids.map(id => parseInt(id)) // Array of campus IDs
      };

      // If using existing department, include the ID
      if (!isCreatingNew && formData.department_id) {
        submitData.department_id = parseInt(formData.department_id);
      }
      
      await onSave(submitData);
    } catch (err) {
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
      } catch (err) {
        setError(err?.message || 'Failed to delete department');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Assign Department to Campus(es)' : 'Edit Department Campus Assignment'}
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

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Department Selection */}
            {mode === 'create' && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="radio"
                    checked={!isCreatingNew}
                    onChange={() => setIsCreatingNew(false)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">Use Existing Department</span>
                </label>
                
                {!isCreatingNew && (
                  <div className="ml-6">
                    <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Department *
                    </label>
                    <select
                      id="department-select"
                      value={formData.department_id}
                      onChange={(e) => handleInputChange('department_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="">Select a Department</option>
                      {allDepartments.map(dept => (
                        <option key={dept.id} value={dept.id.toString()}>
                          {dept.department_code} - {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <label className="flex items-center gap-2 mt-4">
                  <input
                    type="radio"
                    checked={isCreatingNew}
                    onChange={() => setIsCreatingNew(true)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">Create New Department</span>
                </label>
              </div>
            )}

            {/* New Department Fields */}
            {(isCreatingNew || mode === 'edit') && (
              <>
                <div className="md:col-span-2">
                  <label htmlFor="department-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name {isCreatingNew && '*'}
                  </label>
                  <input
                    id="department-name"
                    type="text"
                    required={isCreatingNew}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter department name"
                    disabled={isSubmitting || (mode === 'edit' && !isCreatingNew)}
                  />
                </div>

                <div>
                  <label htmlFor="department-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Department Code {isCreatingNew && '*'}
                  </label>
                  <input
                    id="department-code"
                    type="text"
                    required={isCreatingNew}
                    value={formData.department_code}
                    onChange={(e) => handleInputChange('department_code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., CS, IT, FYF"
                    disabled={isSubmitting || (mode === 'edit' && !isCreatingNew)}
                  />
                </div>
              </>
            )}

            {/* Campus Selection - MULTIPLE SELECT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Campuses *
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {campuses.map(campus => (
                  <label key={campus.campus_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.campus_ids.includes(campus.campus_id.toString())}
                      onChange={() => handleCampusToggle(campus.campus_id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">
                      {campus.campus_name}
                    </span>
                  </label>
                ))}
              </div>
              {formData.campus_ids.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select at least one campus</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Selected {formData.campus_ids.length} of {campuses.length} campuses
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="md:col-span-2">
                <label htmlFor="department-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="department-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department description..."
                  disabled={isSubmitting}
                />
              </div>

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
          </div>

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
                  Remove from Selected Campuses
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Assign Department' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Course Modal Component (unchanged)
const CourseModal = ({ 
  course, 
  department, 
  programs,
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    nqf_level: '',
    credits: '',
    duration: '',
    program_id: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (course && mode === 'edit') {
        setFormData({
          course_code: course.course_code || '',
          course_name: course.course_name || '',
          description: course.description || '',
          nqf_level: course.nqf_level || '',
          credits: course.credits || '',
          duration: course.duration || '',
          program_id: course.program_id || '',
          is_active: course.is_active !== undefined ? course.is_active : true
        });
      } else {
        setFormData({
          course_code: '',
          course_name: '',
          description: '',
          nqf_level: '',
          credits: '',
          duration: '',
          program_id: programs[0]?.program_id || '',
          is_active: true
        });
      }
      setError('');
    }
  }, [isOpen, course, mode, programs]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    if (!formData.course_code.trim()) {
      setError('Course code is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.course_name.trim()) {
      setError('Course name is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.program_id) {
      setError('Please select a program for this course');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        department_id: department.id
      };
      
      await onSave(submitData);
    } catch (err) {
      setError(err?.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!course || !onDelete) return;

    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setIsSubmitting(true);
      try {
        await onDelete(course.course_id);
      } catch (err) {
        setError(err?.message || 'Failed to delete course');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? `Add Course to ${department?.name}` : 'Edit Course'}
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

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="course-code" className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <input
                id="course-code"
                type="text"
                required
                value={formData.course_code}
                onChange={(e) => handleInputChange('course_code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CS101, MATH201"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="course-name" className="block text-sm font-medium text-gray-700 mb-2">
                Course Name *
              </label>
              <input
                id="course-name"
                type="text"
                required
                value={formData.course_name}
                onChange={(e) => handleInputChange('course_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Introduction to Computer Science"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="program-select" className="block text-sm font-medium text-gray-700 mb-2">
                Associated Program *
              </label>
              <select
                id="program-select"
                required
                value={formData.program_id}
                onChange={(e) => handleInputChange('program_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_code} - {program.program_name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Select which program this course belongs to</p>
            </div>

            <div>
              <label htmlFor="nqf-level" className="block text-sm font-medium text-gray-700 mb-2">
                NQF Level
              </label>
              <input
                id="nqf-level"
                type="number"
                min="1"
                max="10"
                value={formData.nqf_level}
                onChange={(e) => handleInputChange('nqf_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 5"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                Credits
              </label>
              <input
                id="credits"
                type="number"
                min="1"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 12"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                id="duration"
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1 semester, 6 months"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">Active Course</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="course-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="course-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course description..."
                disabled={isSubmitting}
              />
            </div>
          </div>

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
                  Delete Course
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Course' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Program Modal Component (unchanged)
const ProgramModal = ({ 
  program, 
  department, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    program_code: '',
    program_name: '',
    description: '',
    duration: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (program && mode === 'edit') {
        setFormData({
          program_code: program.program_code || '',
          program_name: program.program_name || '',
          description: program.description || '',
          duration: program.duration || '',
          is_active: program.is_active !== undefined ? program.is_active : true
        });
      } else {
        setFormData({
          program_code: '',
          program_name: '',
          description: '',
          duration: '',
          is_active: true
        });
      }
      setError('');
    }
  }, [isOpen, program, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    if (!formData.program_code.trim()) {
      setError('Program code is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.program_name.trim()) {
      setError('Program name is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.duration.trim()) {
      setError('Duration is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        department_id: department.id
      };
      
      await onSave(submitData);
    } catch (err) {
      setError(err?.message || 'Failed to save program');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!program || !onDelete) return;

    if (window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      setIsSubmitting(true);
      try {
        await onDelete(program.program_id);
      } catch (err) {
        setError(err?.message || 'Failed to delete program');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? `Add Program to ${department?.name}` : 'Edit Program'}
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

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="program-code" className="block text-sm font-medium text-gray-700 mb-2">
                Program Code *
              </label>
              <input
                id="program-code"
                type="text"
                required
                value={formData.program_code}
                onChange={(e) => handleInputChange('program_code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., DPIFF0, DPIF20, ADIF20"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="program-name" className="block text-sm font-medium text-gray-700 mb-2">
                Program Name *
              </label>
              <input
                id="program-name"
                type="text"
                required
                value={formData.program_name}
                onChange={(e) => handleInputChange('program_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Diploma in Informatics - Foundation"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="program-duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                id="program-duration"
                type="text"
                required
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 4 Years (Foundation), 3 Years, 2 Years"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">Active Program</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="program-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="program-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter program description..."
                disabled={isSubmitting}
              />
            </div>
          </div>

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
                  Delete Program
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Program' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Lecturer Modal Component (unchanged)
const LecturerModal = ({ 
  lecturer, 
  department, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    office: '',
    phone: '',
    position: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (lecturer && mode === 'edit') {
        setFormData({
          name: lecturer.name || '',
          email: lecturer.email || '',
          office: lecturer.office || '',
          phone: lecturer.phone || '',
          position: lecturer.position || '',
          is_active: lecturer.is_active !== undefined ? lecturer.is_active : true
        });
      } else {
        setFormData({
          name: '',
          email: '',
          office: '',
          phone: '',
          position: '',
          is_active: true
        });
      }
      setError('');
    }
  }, [isOpen, lecturer, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Lecturer name is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        department_id: department.id
      };
      
      await onSave(submitData);
    } catch (err) {
      setError(err?.message || 'Failed to save lecturer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!lecturer || !onDelete) return;

    if (window.confirm('Are you sure you want to delete this lecturer? This action cannot be undone.')) {
      setIsSubmitting(true);
      try {
        await onDelete(lecturer.lecturer_id);
      } catch (err) {
        setError(err?.message || 'Failed to delete lecturer');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? `Add Lecturer to ${department?.name}` : 'Edit Lecturer'}
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

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="lecturer-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="lecturer-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Ms. Irene Abraham-Samgeorge"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="lecturer-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="lecturer-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., abrahamia@tut.ac.za"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="lecturer-office" className="block text-sm font-medium text-gray-700 mb-2">
                Office Location
              </label>
              <input
                id="lecturer-office"
                type="text"
                value={formData.office}
                onChange={(e) => handleInputChange('office', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 18-G07, 12-108"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="lecturer-phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Extension
              </label>
              <input
                id="lecturer-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 9796"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="lecturer-position" className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                id="lecturer-position"
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Module Coordinator, Lecturer"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">Active Lecturer</span>
              </label>
            </div>
          </div>

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
                  Delete Lecturer
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Lecturer' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Subject Assignment Modal Component (unchanged)
const SubjectAssignmentModal = ({ 
  assignment, 
  department, 
  programs,
  lecturers,
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    program_id: '',
    subject_code: '',
    subject_name: '',
    lecturer_ids: [],
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (assignment && mode === 'edit') {
        setFormData({
          program_id: assignment.program_id || '',
          subject_code: assignment.subject_code || '',
          subject_name: assignment.subject_name || '',
          lecturer_ids: assignment.lecturers?.map(l => l.lecturer_id) || [],
          is_active: assignment.is_active !== undefined ? assignment.is_active : true
        });
      } else {
        setFormData({
          program_id: programs[0]?.program_id || '',
          subject_code: '',
          subject_name: '',
          lecturer_ids: [],
          is_active: true
        });
      }
      setError('');
    }
  }, [isOpen, assignment, mode, programs]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLecturerToggle = (lecturerId) => {
    setFormData(prev => ({
      ...prev,
      lecturer_ids: prev.lecturer_ids.includes(lecturerId)
        ? prev.lecturer_ids.filter(id => id !== lecturerId)
        : [...prev.lecturer_ids, lecturerId]
    }));
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    if (!formData.program_id) {
      setError('Program is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.subject_code.trim()) {
      setError('Subject code is required');
      setIsSubmitting(false);
      return;
    }
    if (!formData.subject_name.trim()) {
      setError('Subject name is required');
      setIsSubmitting(false);
      return;
    }
    if (formData.lecturer_ids.length === 0) {
      setError('At least one lecturer must be assigned');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        department_id: department.id
      };
      
      await onSave(submitData);
    } catch (err) {
      setError(err?.message || 'Failed to save subject assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!assignment || !onDelete) return;

    if (window.confirm('Are you sure you want to delete this subject assignment? This action cannot be undone.')) {
      setIsSubmitting(true);
      try {
        await onDelete(assignment.assignment_id);
      } catch (err) {
        setError(err?.message || 'Failed to delete assignment');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? `Assign Subject in ${department?.name}` : 'Edit Subject Assignment'}
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

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="program-select" className="block text-sm font-medium text-gray-700 mb-2">
                Program *
              </label>
              <select
                id="program-select"
                required
                value={formData.program_id}
                onChange={(e) => handleInputChange('program_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_code} - {program.program_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject-code" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code *
              </label>
              <input
                id="subject-code"
                type="text"
                required
                value={formData.subject_code}
                onChange={(e) => handleInputChange('subject_code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., BCMF15D, TROF05D"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name *
              </label>
              <input
                id="subject-name"
                type="text"
                required
                value={formData.subject_name}
                onChange={(e) => handleInputChange('subject_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Business Communication, Technical Report Writing"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Lecturers *
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {lecturers.map(lecturer => (
                  <label key={lecturer.lecturer_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.lecturer_ids.includes(lecturer.lecturer_id)}
                      onChange={() => handleLecturerToggle(lecturer.lecturer_id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">
                      {lecturer.name} ({lecturer.email})
                    </span>
                  </label>
                ))}
              </div>
              {formData.lecturer_ids.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select at least one lecturer</p>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">Active Assignment</span>
              </label>
            </div>
          </div>

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
                  Delete Assignment
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Assignment' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Departments Section Component - UPDATED VERSION
const DepartmentsSection = () => {
  const [departments, setDepartments] = useState([]);
  const [allCampuses, setAllCampuses] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]); // NEW: All unique departments
  const [loadingCourses, setLoadingCourses] = useState(new Set());
  const [coursesCache, setCoursesCache] = useState({});
  const [programsCache, setProgramsCache] = useState({});
  const [lecturersCache, setLecturersCache] = useState({});
  const [assignmentsCache, setAssignmentsCache] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [lecturerModalOpen, setLecturerModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  const [departmentModalMode, setDepartmentModalMode] = useState('create');
  const [courseModalMode, setCourseModalMode] = useState('create');
  const [programModalMode, setProgramModalMode] = useState('create');
  const [lecturerModalMode, setLecturerModalMode] = useState('create');
  const [assignmentModalMode, setAssignmentModalMode] = useState('create');

  // Toast functionality
  const { showToast, ToastComponent } = useToast();

  // NEW: Fetch all unique departments
  const fetchAllDepartments = async () => {
    try {
      console.log('📂 Fetching all unique departments from API...');
      const response = await fetch(`${API_URL}/api/departments/all`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch all departments: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🏫 All Departments API response:', result);
      
      if (result.success) {
        console.log(`✅ Successfully fetched ${result.data.length} unique departments:`, 
          result.data.map(d => d.department_code));
        setAllDepartments(result.data);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch all departments');
      }
    } catch (err) {
      console.error('❌ Error fetching all departments:', err);
      // Fallback: Extract unique departments from current data
      const uniqueDepts = Array.from(new Map(
        departments.flatMap(campusGroup => 
          campusGroup.departments?.map(dept => [dept.id, dept]) || []
        ).values()
      ));
      console.log('🔄 Using fallback unique departments:', uniqueDepts);
      setAllDepartments(uniqueDepts);
      return uniqueDepts;
    }
  };

  // Fetch all campuses separately
  const fetchAllCampuses = async () => {
    try {
      console.log('📂 Fetching all campuses from API...');
      const response = await fetch(`${API_URL}/api/departments/campuses/all`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campuses: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🏫 Campuses API response:', result);
      
      if (result.success) {
        console.log(`✅ Successfully fetched ${result.data.length} campuses:`, 
          result.data.map(c => c.campus_name));
        setAllCampuses(result.data);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch campuses');
      }
    } catch (err) {
      console.error('❌ Error fetching campuses:', err);
      // Fallback: Create campuses from departments data
      const fallbackCampuses = departments.flatMap(campusGroup => ({
        campus_id: campusGroup.campusId,
        campus_name: campusGroup.campusName,
        is_active: true
      }));
      console.log('🔄 Using fallback campuses:', fallbackCampuses);
      setAllCampuses(fallbackCampuses);
      return fallbackCampuses;
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all data in parallel
      await Promise.all([
        fetchAllDepartments(), // NEW: Fetch unique departments
        fetchAllCampuses(),    // Fetch campuses
        (async () => {
          // Your existing department fetch logic
          const response = await fetch(`${API_URL}/api/departments`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          
          if (result.success) {
            const transformedData = result.data.map(campusGroup => ({
              ...campusGroup,
              departments: campusGroup.departments?.map(dept => ({
                ...dept,
                buildingNumber: dept.building_number,
                contactNumber: dept.contact_number,
                websiteLink: dept.website_link,
                courses: dept.courses || []
              })) || []
            }));
            
            setDepartments(transformedData);
          } else {
            throw new Error(result.error || 'Failed to fetch departments');
          }
        })()
      ]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch departments';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data functions (unchanged)
  const handleLoadCourses = async (departmentId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/courses/department/${departmentId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        return (result.data || []).map(course => ({
          ...course,
          duration: course.duration || 'Not specified'
        }));
      }
      throw new Error(result.error || 'API returned error');
    } catch (err) {
      console.error('Error loading courses:', err);
      throw err;
    }
  };

  const handleLoadPrograms = async (departmentId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/programs/department/${departmentId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        return (result.data || []).map(program => ({
          ...program,
          duration: program.duration || 'Not specified'
        }));
      }
      throw new Error(result.error || 'API returned error');
    } catch (err) {
      console.error('Error loading programs:', err);
      throw err;
    }
  };

  const handleLoadLecturers = async (departmentId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/lecturers/department/${departmentId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) return result.data || [];
      throw new Error(result.error || 'API returned error');
    } catch (err) {
      console.error('Error loading lecturers:', err);
      throw err;
    }
  };

  const handleLoadAssignments = async (departmentId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/subject-assignments/department/${departmentId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        return (result.data || []).map(assignment => ({
          ...assignment,
          lecturers: assignment.lecturers || []
        }));
      }
      throw new Error(result.error || 'API returned error');
    } catch (err) {
      console.error('Error loading assignments:', err);
      throw err;
    }
  };

  // Department management - UPDATED for multiple campuses
  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setDepartmentModalMode('create');
    setDepartmentModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setDepartmentModalMode('edit');
    setDepartmentModalOpen(true);
  };

  const handleSaveDepartment = async (departmentData) => {
    const url = departmentModalMode === 'create' 
      ? `${API_URL}/api/departments`
      : `${API_URL}/api/departments/${selectedDepartment?.id}`;
    
    const method = departmentModalMode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${departmentModalMode === 'create' ? 'create' : 'update'} department`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchDepartments();
        setDepartmentModalOpen(false);
        showToast(`Department ${departmentModalMode === 'create' ? 'created' : 'updated'} successfully`, 'success');
        return result.data;
      } else {
        throw new Error(result.error || `Failed to ${departmentModalMode === 'create' ? 'create' : 'update'} department`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/${departmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete department');
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchDepartments();
        setDepartmentModalOpen(false);
        showToast('Department deleted successfully', 'success');
      } else {
        throw new Error(result.error || 'Failed to delete department');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  // Rest of the management functions remain unchanged...
  // [Course, Program, Lecturer, Assignment management functions remain the same]

  // Course management (unchanged)
  const handleCreateCourse = (department) => {
    setSelectedDepartment(department);
    setSelectedCourse(null);
    setCourseModalMode('create');
    setCourseModalOpen(true);
  };

  const handleEditCourse = (course, department) => {
    setSelectedDepartment(department);
    setSelectedCourse(course);
    setCourseModalMode('edit');
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (courseData) => {
    const url = courseModalMode === 'create' 
      ? `${API_URL}/api/departments/courses`
      : `${API_URL}/api/departments/courses/${selectedCourse?.course_id}`;
    
    const method = courseModalMode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${courseModalMode === 'create' ? 'create' : 'update'} course`);
      }

      const result = await response.json();
      
      if (result.success) {
        const updatedCourses = await handleLoadCourses(courseData.department_id);
        setCoursesCache(prev => ({
          ...prev,
          [courseData.department_id]: updatedCourses
        }));
        
        setCourseModalOpen(false);
        showToast(`Course ${courseModalMode === 'create' ? 'created' : 'updated'} successfully`, 'success');
        return result.data;
      } else {
        throw new Error(result.error || `Failed to ${courseModalMode === 'create' ? 'create' : 'update'} course`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete course');
      }

      const result = await response.json();
      
      if (result.success) {
        if (selectedDepartment) {
          const updatedCourses = await handleLoadCourses(selectedDepartment.id);
          setCoursesCache(prev => ({
            ...prev,
            [selectedDepartment.id]: updatedCourses
          }));
        }
        
        setCourseModalOpen(false);
        showToast('Course deleted successfully', 'success');
      } else {
        throw new Error(result.error || 'Failed to delete course');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  // Program management (unchanged)
  const handleCreateProgram = (department) => {
    setSelectedDepartment(department);
    setSelectedProgram(null);
    setProgramModalMode('create');
    setProgramModalOpen(true);
  };

  const handleEditProgram = (program, department) => {
    setSelectedDepartment(department);
    setSelectedProgram(program);
    setProgramModalMode('edit');
    setProgramModalOpen(true);
  };

  const handleSaveProgram = async (programData) => {
    const url = programModalMode === 'create' 
      ? `${API_URL}/api/departments/programs`
      : `${API_URL}/api/departments/programs/${selectedProgram?.program_id}`;
    
    const method = programModalMode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${programModalMode === 'create' ? 'create' : 'update'} program`);
      }

      const result = await response.json();
      
      if (result.success) {
        const updatedPrograms = await handleLoadPrograms(programData.department_id);
        setProgramsCache(prev => ({
          ...prev,
          [programData.department_id]: updatedPrograms
        }));
        
        setProgramModalOpen(false);
        showToast(`Program ${programModalMode === 'create' ? 'created' : 'updated'} successfully`, 'success');
        return result.data;
      } else {
        throw new Error(result.error || `Failed to ${programModalMode === 'create' ? 'create' : 'update'} program`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteProgram = async (programId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/programs/${programId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete program');
      }

      const result = await response.json();
      
      if (result.success) {
        if (selectedDepartment) {
          const updatedPrograms = await handleLoadPrograms(selectedDepartment.id);
          setProgramsCache(prev => ({
            ...prev,
            [selectedDepartment.id]: updatedPrograms
          }));
        }
        
        setProgramModalOpen(false);
        showToast('Program deleted successfully', 'success');
      } else {
        throw new Error(result.error || 'Failed to delete program');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  // Lecturer management (unchanged)
  const handleCreateLecturer = (department) => {
    setSelectedDepartment(department);
    setSelectedLecturer(null);
    setLecturerModalMode('create');
    setLecturerModalOpen(true);
  };

  const handleEditLecturer = (lecturer, department) => {
    setSelectedDepartment(department);
    setSelectedLecturer(lecturer);
    setLecturerModalMode('edit');
    setLecturerModalOpen(true);
  };

  const handleSaveLecturer = async (lecturerData) => {
    const url = lecturerModalMode === 'create' 
      ? `${API_URL}/api/departments/lecturers`
      : `${API_URL}/api/departments/lecturers/${selectedLecturer?.lecturer_id}`;
    
    const method = lecturerModalMode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lecturerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${lecturerModalMode === 'create' ? 'create' : 'update'} lecturer`);
      }

      const result = await response.json();
      
      if (result.success) {
        const updatedLecturers = await handleLoadLecturers(lecturerData.department_id);
        setLecturersCache(prev => ({
          ...prev,
          [lecturerData.department_id]: updatedLecturers
        }));
        
        setLecturerModalOpen(false);
        showToast(`Lecturer ${lecturerModalMode === 'create' ? 'created' : 'updated'} successfully`, 'success');
        return result.data;
      } else {
        throw new Error(result.error || `Failed to ${lecturerModalMode === 'create' ? 'create' : 'update'} lecturer`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteLecturer = async (lecturerId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/lecturers/${lecturerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete lecturer');
      }

      const result = await response.json();
      
      if (result.success) {
        if (selectedDepartment) {
          const updatedLecturers = await handleLoadLecturers(selectedDepartment.id);
          setLecturersCache(prev => ({
            ...prev,
            [selectedDepartment.id]: updatedLecturers
          }));
        }
        
        setLecturerModalOpen(false);
        showToast('Lecturer deleted successfully', 'success');
      } else {
        throw new Error(result.error || 'Failed to delete lecturer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  // Assignment management (unchanged)
  const handleCreateAssignment = (department) => {
    setSelectedDepartment(department);
    setSelectedAssignment(null);
    setAssignmentModalMode('create');
    setAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment, department) => {
    setSelectedDepartment(department);
    setSelectedAssignment(assignment);
    setAssignmentModalMode('edit');
    setAssignmentModalOpen(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    const url = assignmentModalMode === 'create' 
      ? `${API_URL}/api/departments/subject-assignments`
      : `${API_URL}/api/departments/subject-assignments/${selectedAssignment?.assignment_id}`;
    
    const method = assignmentModalMode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${assignmentModalMode === 'create' ? 'create' : 'update'} assignment`);
      }

      const result = await response.json();
      
      if (result.success) {
        const updatedAssignments = await handleLoadAssignments(assignmentData.department_id);
        setAssignmentsCache(prev => ({
          ...prev,
          [assignmentData.department_id]: updatedAssignments
        }));
        
        setAssignmentModalOpen(false);
        showToast(`Subject assignment ${assignmentModalMode === 'create' ? 'created' : 'updated'} successfully`, 'success');
        return result.data;
      } else {
        throw new Error(result.error || `Failed to ${assignmentModalMode === 'create' ? 'create' : 'update'} assignment`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`${API_URL}/api/departments/subject-assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete assignment');
      }

      const result = await response.json();
      
      if (result.success) {
        if (selectedDepartment) {
          const updatedAssignments = await handleLoadAssignments(selectedDepartment.id);
          setAssignmentsCache(prev => ({
            ...prev,
            [selectedDepartment.id]: updatedAssignments
          }));
        }
        
        setAssignmentModalOpen(false);
        showToast('Subject assignment deleted successfully', 'success');
      } else {
        throw new Error(result.error || 'Failed to delete assignment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDepartments();
  };

  const handleToggleDepartment = async (department) => {
    const departmentId = department.id;
    
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
      
      if (!coursesCache[departmentId] && !loadingCourses.has(departmentId)) {
        setLoadingCourses(prev => new Set(prev).add(departmentId));
        setError('');
        
        try {
          const [courses, programs, lecturers, assignments] = await Promise.all([
            handleLoadCourses(departmentId),
            handleLoadPrograms(departmentId),
            handleLoadLecturers(departmentId),
            handleLoadAssignments(departmentId)
          ]);
          
          setCoursesCache(prev => ({ ...prev, [departmentId]: courses }));
          setProgramsCache(prev => ({ ...prev, [departmentId]: programs }));
          setLecturersCache(prev => ({ ...prev, [departmentId]: lecturers }));
          setAssignmentsCache(prev => ({ ...prev, [departmentId]: assignments }));
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load department data';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setLoadingCourses(prev => {
            const newSet = new Set(prev);
            newSet.delete(departmentId);
            return newSet;
          });
        }
      }
    }
    setExpandedDepartments(newExpanded);
  };

  const handleRetryLoadCourses = async (departmentId) => {
    setLoadingCourses(prev => new Set(prev).add(departmentId));
    setError('');
    
    try {
      const courses = await handleLoadCourses(departmentId);
      setCoursesCache(prev => ({
        ...prev,
        [departmentId]: courses
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load courses';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoadingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(departmentId);
        return newSet;
      });
    }
  };

  // Helper function to get courses for a specific program
  const getCoursesForProgram = (departmentId, programId) => {
    const courses = coursesCache[departmentId] || [];
    return courses.filter(course => course.program_id === programId);
  };

  // Get campuses for modal - NOW USING allCampuses
  const campuses = allCampuses;

  // Debug campuses data
  useEffect(() => {
    console.log('🎯 Current campuses state:', campuses);
    console.log('🔍 Looking for Polokwane:', campuses.find(c => 
      c.campus_name?.toLowerCase().includes('polokwane')));
  }, [campuses]);

  // Initial load
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter departments based on search and campus filter
  const filteredDepartments = departments.filter(campusGroup => {
    const matchesCampus = campusFilter === 'all' || 
      campusGroup.campusName.toLowerCase().includes(campusFilter.toLowerCase());
    
    if (!matchesCampus) return false;

    const filteredDepts = campusGroup.departments?.filter(dept => 
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.department_code?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return filteredDepts.length > 0;
  }).map(campusGroup => ({
    ...campusGroup,
    departments: campusGroup.departments?.filter(dept => 
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.department_code?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
  }));

  const getCampusInitials = (campusName) => {
    return campusName.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || 'C';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      { label: 'Active', class: 'bg-green-100 text-green-700' } : 
      { label: 'Inactive', class: 'bg-gray-100 text-gray-700' };
  };

  // Loading state
  if (loading && departments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Departments</h3>
        <p className="text-gray-500">Fetching department information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastComponent />

      {/* Header with Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Departments & Programs</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage departments, programs, and courses across all campuses
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh departments"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search departments..."
                className="pl-3 pr-10 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Campuses</option>
              {campuses.map(campus => (
                <option key={campus.campus_id} value={campus.campus_name}>
                  {campus.campus_name}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateDepartment}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mb-4 p-3 rounded-md bg-blue-50 text-blue-800 text-sm border border-blue-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Available Campuses: {campuses.length} | Departments: {departments.length} | Unique Departments: {allDepartments.length}</span>
          </div>
        </div>

        {/* Departments List */}
        <div className="space-y-6">
          {filteredDepartments.map(campusGroup => (
            <section key={campusGroup.campusId} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Campus Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {getCampusInitials(campusGroup.campusName)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {campusGroup.campusName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {campusGroup.departments.length} department{campusGroup.departments.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Departments List */}
              <div className="divide-y divide-gray-100">
                {campusGroup.departments.map(department => {
                  const isExpanded = expandedDepartments.has(department.id);
                  const isLoading = loadingCourses.has(department.id);
                  const departmentCourses = coursesCache[department.id] || [];
                  const departmentPrograms = programsCache[department.id] || [];
                  const departmentLecturers = lecturersCache[department.id] || [];
                  const departmentAssignments = assignmentsCache[department.id] || [];
                  const status = getStatusBadge(department.is_active);
                  const isFYFDepartment = department.department_code?.toLowerCase() === 'fyf';

                  return (
                    <div key={department.id} className="bg-white">
                      {/* Department Header */}
                      <div 
                        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleToggleDepartment(department)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${department.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-semibold text-gray-900 truncate">
                                {department.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                {status.label}
                              </span>
                              {department.department_code && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {department.department_code}
                                </span>
                              )}
                              {isFYFDepartment && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                  First Year Foundation
                                </span>
                              )}
                            </div>
                            
                            {department.description && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {department.description}
                              </p>
                            )}
                            
                            {departmentPrograms.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {departmentPrograms.slice(0, 3).map(program => (
                                  <span key={program.program_id} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                    {program.program_code}
                                  </span>
                                ))}
                                {departmentPrograms.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    +{departmentPrograms.length - 3} more programs
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {isLoading ? (
                                <span className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                  Loading...
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-4 h-4" />
                                  {departmentPrograms.length} programs, {departmentCourses.length} courses
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100">
                          <div className="grid lg:grid-cols-2 gap-8 pt-4">
                            {/* Left Column - Programs and Courses */}
                            <div className="space-y-6">
                              {/* Programs Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Academic Programs ({departmentPrograms.length})
                                  </h5>
                                  <button
                                    onClick={() => handleCreateProgram(department)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add Program
                                  </button>
                                </div>

                                {departmentPrograms.length > 0 ? (
                                  <div className="space-y-4">
                                    {departmentPrograms.map(program => {
                                      const programCourses = getCoursesForProgram(department.id, program.program_id);
                                      return (
                                        <div
                                          key={program.program_id}
                                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 mb-1">
                                                <h6 className="font-semibold text-gray-900 text-sm">
                                                  {program.program_code}
                                                </h6>
                                                {program.is_active ? (
                                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    Active
                                                  </span>
                                                ) : (
                                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    Inactive
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-gray-600 text-sm mt-1">
                                                {program.program_name}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-1 ml-2">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditProgram(program, department);
                                                }}
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Edit program"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            {program.duration && (
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {program.duration}
                                              </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                              <BookOpen className="w-3 h-3" />
                                              {programCourses.length} courses
                                            </span>
                                          </div>
                                          {program.description && (
                                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                                              {program.description}
                                            </p>
                                          )}
                                          {/* Show courses for this program */}
                                          {programCourses.length > 0 && (
                                            <div className="border-t border-gray-100 pt-3">
                                              <p className="text-xs font-medium text-gray-700 mb-2">Courses in this program:</p>
                                              <div className="space-y-2">
                                                {programCourses.slice(0, 3).map(course => (
                                                  <div key={course.course_id} className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-600">
                                                      {course.course_code} - {course.course_name}
                                                    </span>
                                                    <span className="text-gray-400">
                                                      {course.credits || '0'} credits
                                                    </span>
                                                  </div>
                                                ))}
                                                {programCourses.length > 3 && (
                                                  <p className="text-xs text-gray-500">
                                                    +{programCourses.length - 3} more courses
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No programs available</p>
                                    <button
                                      onClick={() => handleCreateProgram(department)}
                                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                      Add First Program
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Courses Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    All Courses ({departmentCourses.length})
                                  </h5>
                                  <button
                                    onClick={() => handleCreateCourse(department)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add Course
                                  </button>
                                </div>

                                {isLoading ? (
                                  <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                  </div>
                                ) : error && !departmentCourses.length ? (
                                  <div className="text-center py-4">
                                    <p className="text-red-600 text-sm mb-3">Failed to load courses</p>
                                    <button
                                      onClick={() => handleRetryLoadCourses(department.id)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                    >
                                      Retry
                                    </button>
                                  </div>
                                ) : departmentCourses.length > 0 ? (
                                  <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {departmentCourses.map(course => {
                                      const program = departmentPrograms.find(p => p.program_id === course.program_id);
                                      return (
                                        <div
                                          key={course.course_id}
                                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 mb-1">
                                                <h6 className="font-semibold text-gray-900 text-sm">
                                                  {course.course_code}
                                                </h6>
                                                {course.is_active ? (
                                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    Active
                                                  </span>
                                                ) : (
                                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    Inactive
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                {course.course_name}
                                              </p>
                                              {program && (
                                                <p className="text-xs text-purple-600 mt-1">
                                                  Part of: {program.program_code} - {program.program_name}
                                                </p>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-1 ml-2">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditCourse(course, department);
                                                }}
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Edit course"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-4 text-xs text-gray-500">
                                            {course.nqf_level && (
                                              <span>NQF {course.nqf_level}</span>
                                            )}
                                            {course.credits && (
                                              <span>{course.credits} credits</span>
                                            )}
                                            {course.duration && (
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {course.duration}
                                              </span>
                                            )}
                                          </div>
                                          {course.description && (
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                              {course.description}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No courses available</p>
                                    <button
                                      onClick={() => handleCreateCourse(department)}
                                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                      Add First Course
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Column - Lecturers, Assignments, and Department Details */}
                            <div className="space-y-6">
                              {/* Lecturers Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Lecturers ({departmentLecturers.length})
                                  </h5>
                                  <button
                                    onClick={() => handleCreateLecturer(department)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add Lecturer
                                  </button>
                                </div>

                                {departmentLecturers.length > 0 ? (
                                  <div className="space-y-3 max-h-40 overflow-y-auto">
                                    {departmentLecturers.map(lecturer => (
                                      <div
                                        key={lecturer.lecturer_id}
                                        className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h6 className="font-semibold text-gray-900 text-sm">
                                                {lecturer.name}
                                              </h6>
                                              {lecturer.is_active ? (
                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                  Active
                                                </span>
                                              ) : (
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                  Inactive
                                                </span>
                                              )}
                                            </div>
                                            <a 
                                              href={`mailto:${lecturer.email}`}
                                              className="text-blue-600 hover:text-blue-800 text-xs"
                                            >
                                              {lecturer.email}
                                            </a>
                                            {lecturer.office && (
                                              <p className="text-xs text-gray-500 mt-1">
                                                Office: {lecturer.office}
                                              </p>
                                            )}
                                            {lecturer.position && (
                                              <p className="text-xs text-gray-500">
                                                Position: {lecturer.position}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1 ml-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditLecturer(lecturer, department);
                                              }}
                                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                              title="Edit lecturer"
                                            >
                                              <Edit className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No lecturers available</p>
                                    <button
                                      onClick={() => handleCreateLecturer(department)}
                                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                      Add First Lecturer
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Subject Assignments Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <Link className="w-4 h-4" />
                                    Subject Assignments ({departmentAssignments.length})
                                  </h5>
                                  <button
                                    onClick={() => handleCreateAssignment(department)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add Assignment
                                  </button>
                                </div>

                                {departmentAssignments.length > 0 ? (
                                  <div className="space-y-3 max-h-40 overflow-y-auto">
                                    {departmentAssignments.map(assignment => (
                                      <div
                                        key={assignment.assignment_id}
                                        className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h6 className="font-semibold text-gray-900 text-sm">
                                                {assignment.subject_code}
                                              </h6>
                                              {assignment.is_active ? (
                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                  Active
                                                </span>
                                              ) : (
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                  Inactive
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-gray-600 text-xs line-clamp-1">
                                              {assignment.subject_name}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                              Program: {assignment.program_code}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                              Lecturers: {assignment.lecturers?.map(l => l.name).join(', ')}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1 ml-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditAssignment(assignment, department);
                                              }}
                                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                              title="Edit assignment"
                                              >
                                              <Edit className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    <Link className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No subject assignments</p>
                                    <button
                                      onClick={() => handleCreateAssignment(department)}
                                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                      Add First Assignment
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Department Details */}
                              <div>
                                <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Department Details
                                </h5>
                                
                                <div className="space-y-4">
                                  {department.description && (
                                    <div>
                                      <p className="text-sm text-gray-700 leading-relaxed">
                                        {department.description}
                                      </p>
                                    </div>
                                  )}

                                  <div className="space-y-3">
                                    {department.email && (
                                      <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                          <span className="font-medium text-gray-700">Email:</span>
                                          <a 
                                            href={`mailto:${department.email}`}
                                            className="ml-2 text-blue-600 hover:text-blue-800 hover:underline"
                                          >
                                            {department.email}
                                          </a>
                                        </div>
                                      </div>
                                    )}

                                    {department.contact_number && (
                                      <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                          <span className="font-medium text-gray-700">Phone:</span>
                                          <a 
                                            href={`tel:${department.contact_number}`}
                                            className="ml-2 text-blue-600 hover:text-blue-800 hover:underline"
                                          >
                                            {department.contact_number}
                                          </a>
                                        </div>
                                      </div>
                                    )}

                                    {department.building_number && (
                                      <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                          <span className="font-medium text-gray-700">Building:</span>
                                          <span className="ml-2 text-gray-600">{department.building_number}</span>
                                        </div>
                                      </div>
                                    )}

                                    {department.website_link && (
                                      <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                          <span className="font-medium text-gray-700">Website:</span>
                                          <a 
                                            href={department.website_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-blue-600 hover:text-blue-800 hover:underline"
                                          >
                                            Visit Website
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-4 border-t border-gray-200">
                                    <button 
                                      onClick={() => handleEditDepartment(department)}
                                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                      Manage Department
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Empty State */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Departments Found</h3>
            <p className="text-gray-500">
              {searchTerm || campusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No departments are currently available'
              }
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={handleCreateDepartment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            </div>
          </div>
        )}
      </div>

      {/* All Modals */}
      <DepartmentModal
        department={selectedDepartment}
        campuses={campuses}
        allDepartments={allDepartments} // NEW: Pass all unique departments
        isOpen={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        onSave={handleSaveDepartment}
        onDelete={handleDeleteDepartment}
        mode={departmentModalMode}
      />

      <CourseModal
        course={selectedCourse}
        department={selectedDepartment}
        programs={programsCache[selectedDepartment?.id] || []}
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
        mode={courseModalMode}
      />

      <ProgramModal
        program={selectedProgram}
        department={selectedDepartment}
        isOpen={programModalOpen}
        onClose={() => setProgramModalOpen(false)}
        onSave={handleSaveProgram}
        onDelete={handleDeleteProgram}
        mode={programModalMode}
      />

      <LecturerModal
        lecturer={selectedLecturer}
        department={selectedDepartment}
        isOpen={lecturerModalOpen}
        onClose={() => setLecturerModalOpen(false)}
        onSave={handleSaveLecturer}
        onDelete={handleDeleteLecturer}
        mode={lecturerModalMode}
      />

      <SubjectAssignmentModal
        assignment={selectedAssignment}
        department={selectedDepartment}
        programs={programsCache[selectedDepartment?.id] || []}
        lecturers={lecturersCache[selectedDepartment?.id] || []}
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        onDelete={handleDeleteAssignment}
        mode={assignmentModalMode}
      />
    </div>
  );
};

export default DepartmentsSection;