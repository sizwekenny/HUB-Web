import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Shield, Globe, Bell, Database } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Define the structure of settings expected from your API
interface SystemSettings {
  site_title?: string;
  contact_email?: string;
  default_campus?: string;
  max_news_items?: number;
  maintenance_mode?: boolean;
  email_notifications?: boolean;
  [key: string]: string | number | boolean | undefined;
}

const SystemSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.get<SystemSettings>(`${API_URL}/settings`);
      setSettings(response.data);
    } catch (err) {
      setError('Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save each setting individually
      const promises = Object.entries(settings).map(([key, value]) =>
        axios.put(`${API_URL}/settings/${key}`, { value })
      );

      await Promise.all(promises);
      setSuccess('Settings saved successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string | number | boolean): void => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchSettings}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* General Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Title
                </label>
                <input
                  type="text"
                  value={settings.site_title || ''}
                  onChange={(e) => updateSetting('site_title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TUT ICT Faculty Hub"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="info@tut.ac.za"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Campus
                </label>
                <select
                  value={settings.default_campus || ''}
                  onChange={(e) => updateSetting('default_campus', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">Soshanguve South</option>
                  <option value="2">eMalahleni</option>
                  <option value="3">Polokwane</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max News Items
                </label>
                <input
                  type="number"
                  value={settings.max_news_items ?? ''}
                  onChange={(e) =>
                    updateSetting('max_news_items', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50"
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">
                    Enable maintenance mode to restrict access
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!settings.maintenance_mode}
                    onChange={(e) =>
                      updateSetting('maintenance_mode', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">
                    Send email notifications for important events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!settings.email_notifications}
                    onChange={(e) =>
                      updateSetting('email_notifications', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'News Alerts', desc: 'Notify for new news articles' },
                { label: 'Event Reminders', desc: 'Remind about upcoming events' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Database Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-medium text-gray-900">System Information</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">System Version</p>
                  <p className="font-medium text-gray-900">v1.0.0</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Backup</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Database Size</p>
                  <p className="font-medium text-gray-900">~2.5 MB</p>
                </div>
                <div>
                  <p className="text-gray-600">Uptime</p>
                  <p className="font-medium text-gray-900">99.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsSection;
