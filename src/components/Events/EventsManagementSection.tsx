import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import axios from 'axios';

// ✅ API base URL
const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

const EventsManagementSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    campus_id: '',
    department_id: '',
    event_type: 'Academic',
    max_attendees: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchCampuses();
    fetchDepartments();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/events`);
      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        setError(response.data.error || 'Failed to fetch events');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch events';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/campus`);
      console.log('Campuses API response:', response.data);
      if (response.data.success) {
        setCampuses(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching campuses:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/departments`);
      console.log('Departments API response:', response.data);
      
      if (response.data.success && response.data.data) {
        // ✅ Extract and flatten departments from all campus groups
        const allDepartments = [];
        response.data.data.forEach((campusGroup) => {
          if (campusGroup.departments && campusGroup.departments.length > 0) {
            allDepartments.push(...campusGroup.departments);
          }
        });
        
        console.log('Flattened departments:', allDepartments);
        setDepartments(allDepartments);
      } else {
        console.log('No departments data found');
        setDepartments([]);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const formData = {
        ...eventForm,
        campus_id: eventForm.campus_id ? parseInt(eventForm.campus_id) : null,
        department_id: eventForm.department_id ? parseInt(eventForm.department_id) : null,
        max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : null
      };

      if (editingEvent) {
        const response = await axios.put(
          `${API_URL}/api/events/${editingEvent.event_id}`,
          formData
        );
        if (response.data.success) {
          console.log('✅ Event updated successfully');
        } else {
          throw new Error(response.data.error || 'Failed to update event');
        }
      } else {
        const response = await axios.post(
          `${API_URL}/api/events`,
          formData
        );
        if (response.data.success) {
          console.log('✅ Event created successfully');
        } else {
          throw new Error(response.data.error || 'Failed to create event');
        }
      }

      resetForm();
      fetchEvents(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save event';
      setError(errorMessage);
      console.error('Error saving event:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date ? event.event_date.slice(0, 16) : '',
      end_date: event.end_date ? event.end_date.slice(0, 16) : '',
      location: event.location || '',
      campus_id: event.campus_id ? event.campus_id.toString() : '',
      department_id: event.department_id ? event.department_id.toString() : '',
      event_type: event.event_type || 'Academic',
      max_attendees: event.max_attendees ? event.max_attendees.toString() : ''
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/events/${eventId}`);
        if (response.data.success) {
          console.log('✅ Event deleted successfully');
          fetchEvents(); // Refresh the list
        } else {
          setError(response.data.error || 'Failed to delete event');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to delete event';
        setError(errorMessage);
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      event_date: '',
      end_date: '',
      location: '',
      campus_id: '',
      department_id: '',
      event_type: 'Academic',
      max_attendees: ''
    });
    setError('');
  };

  const eventTypes = ['Academic', 'Social', 'Workshop', 'Seminar', 'Other'];

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: 'N/A', time: 'N/A' };
    
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Events Management</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading events...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => {
                const startDateTime = formatDateTime(event.event_date);
                const endDateTime = formatDateTime(event.end_date);
                
                return (
                  <div
                    key={event.event_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {startDateTime.date} at {startDateTime.time}
                              {event.end_date && (
                                <> → {endDateTime.date} at {endDateTime.time}</>
                              )}
                            </span>
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {event.max_attendees && event.max_attendees > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Max: {event.max_attendees}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.event_type === 'Academic'
                                ? 'bg-blue-100 text-blue-700'
                                : event.event_type === 'Social'
                                ? 'bg-green-100 text-green-700'
                                : event.event_type === 'Workshop'
                                ? 'bg-purple-100 text-purple-700'
                                : event.event_type === 'Seminar'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {event.event_type}
                          </span>

                          {event.campus_name && (
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                              {event.campus_name}
                            </span>
                          )}

                          {event.department_name && (
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                              {event.department_name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.event_id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {events.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No events found</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first event
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter event description"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="event_date"
                      value={eventForm.event_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={eventForm.end_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Location & Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={eventForm.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter event location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      name="event_type"
                      value={eventForm.event_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Campus & Department */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campus *
                    </label>
                    <select
                      name="campus_id"
                      value={eventForm.campus_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select Campus</option>
                      {campuses.map((campus) => (
                        <option key={campus.campus_id} value={campus.campus_id}>
                          {campus.campus_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      name="department_id"
                      value={eventForm.department_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {departments.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">No departments available</p>
                    )}
                  </div>
                </div>

                {/* Max Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    name="max_attendees"
                    value={eventForm.max_attendees}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || !eventForm.title || !eventForm.description || !eventForm.event_date || !eventForm.location || !eventForm.campus_id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {submitLoading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagementSection;