import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Helper functions
export const getCategoryId = (categoryName) => {
  const map = {
    'Senior Students': 1,
    'Newcomer Students': 2,
    'All Students': 3,
  };
  return map[categoryName] || 3;
};

export const getCategoryName = (categoryId) => {
  const map = {
    1: 'Senior Students',
    2: 'Newcomer Students',
    3: 'All Students',
  };
  return map[categoryId] || 'All Students';
};

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

// Main Component
const ServicesManagementSection = () => {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newStep, setNewStep] = useState('');

  // Initial service form state
  const initialServiceForm = {
    title: '',
    category: 'Senior Students',
    description: '',
    details: '',
    steps: [],
    statusLink: '',
    isActive: true
  };

  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const { showToast, ToastComponent } = useToast();

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setServicesLoading(true);
    setServicesError('');
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServicesError('Failed to load services. Please try again.');
      showToast('Failed to load services', 'error');
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setServiceSearch(value);
  };

  const handleCategoryChange = (value) => {
    setServiceCategoryFilter(value);
  };

  const handleAdd = () => {
    setEditingService(null);
    setServiceForm(initialServiceForm);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      category: service.category,
      description: service.description,
      details: service.details || '',
      steps: service.steps || [],
      statusLink: service.statusLink || '',
      isActive: service.isActive
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
    setServiceForm(initialServiceForm);
  };

  const handleSave = async () => {
    setSaveLoading(true);

    if (!serviceForm.title || !serviceForm.description) {
      showToast('Title and description are required', 'error');
      setSaveLoading(false);
      return;
    }

    const serviceData = {
      title: serviceForm.title,
      category_id: getCategoryId(serviceForm.category),
      description: serviceForm.description,
      details: serviceForm.details || '',
      steps: serviceForm.steps || [],
      status_link: serviceForm.statusLink || null,
      is_active: true,
    };

    try {
      if (editingService?.id) {
        await axios.put(`${API_URL}/api/services/${editingService.id}`, serviceData);
        showToast('Service updated successfully', 'success');
      } else {
        await axios.post(`${API_URL}/api/services/`, serviceData);
        showToast('Service created successfully', 'success');
      }
      fetchServices(); // Refresh the list
      handleCloseForm();
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to save service. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`${API_URL}/api/services/${id}`);
      setServices(services.filter(service => service.id !== id));
      showToast('Service deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete service. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  // Steps management
  const addStep = () => {
    if (newStep.trim()) {
      setServiceForm({
        ...serviceForm,
        steps: [...serviceForm.steps, newStep.trim()]
      });
      setNewStep('');
    }
  };

  const removeStep = (index) => {
    const newSteps = serviceForm.steps.filter((_, i) => i !== index);
    setServiceForm({ ...serviceForm, steps: newSteps });
  };

  const moveStep = (index, direction) => {
    const newSteps = [...serviceForm.steps];
    const newIndex = index + direction;
    
    if (newIndex >= 0 && newIndex < newSteps.length) {
      [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
      setServiceForm({ ...serviceForm, steps: newSteps });
    }
  };

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                         service.description.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCategory = serviceCategoryFilter === 'All' || service.category === serviceCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Component */}
      <ToastComponent />

      {/* Top Actions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Services Management</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={serviceCategoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All">All Categories</option>
              <option value="Senior Students">Senior Students</option>
              <option value="Newcomer Students">Newcomer Students</option>
              <option value="All Students">All Students</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={serviceSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search services..."
                className="pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              onClick={fetchServices}
              disabled={servicesLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              <span>{servicesLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="p-6">
          {servicesError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {servicesError}
            </div>
          )}

          {servicesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading services...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-3 px-2 font-semibold text-gray-700">Title</th>
                    <th className="py-3 px-2 font-semibold text-gray-700">Category</th>
                    <th className="py-3 px-2 font-semibold text-gray-700">Steps</th>
                    <th className="py-3 px-2 font-semibold text-gray-700">Quick Link</th>
                    <th className="py-3 px-2 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map(service => (
                    <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 max-w-xs">
                        <p className="font-medium text-gray-900 line-clamp-1">{service.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{service.description}</p>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-3 px-2">{service.steps?.length || 0}</td>
                      <td className="py-3 px-2">
                        {service.statusLink ? (
                          <a
                            href={service.statusLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">
                        {serviceSearch || serviceCategoryFilter !== 'All'
                          ? 'No services match your search criteria.'
                          : 'No services found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingService ? 'Edit Service' : 'Create Service'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={saveLoading}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter service title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Senior Students">Senior Students</option>
                    <option value="Newcomer Students">Newcomer Students</option>
                    <option value="All Students">All Students</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter service description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <textarea
                    value={serviceForm.details || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter additional details (optional)"
                    rows={3}
                  />
                </div>

                {/* Steps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Steps</label>
                  <div className="mt-2 space-y-2">
                    {serviceForm.steps?.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="flex-1 border rounded-md px-3 py-2 text-sm bg-gray-50">{step}</span>
                        <button
                          type="button"
                          onClick={() => moveStep(i, -1)}
                          disabled={i === 0}
                          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(i, 1)}
                          disabled={i === serviceForm.steps.length - 1}
                          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          title="Move down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStep(i)}
                          className="p-1 border rounded hover:bg-red-100 text-red-500 transition-colors"
                          title="Remove step"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder="Enter new step"
                        className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newStep.trim()) {
                            addStep();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addStep}
                        disabled={!newStep.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        Add Step
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Link</label>
                  <input
                    type="url"
                    value={serviceForm.statusLink || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, statusLink: e.target.value })}
                    placeholder="https://example.com (optional)"
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleCloseForm}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!serviceForm.title || !serviceForm.description || saveLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  {saveLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : null}
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagementSection;