import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Application } from '@/lib/api';

interface ApplicationActionModalProps {
  application: Application;
  action: 'accept' | 'reject';
  onClose: () => void;
  onSuccess: (status: 'accepted' | 'rejected', emailBody: string) => Promise<void>;
}

export const ApplicationActionModal: React.FC<ApplicationActionModalProps> = ({
  application,
  action,
  onClose,
  onSuccess,
}) => {
  const [saving, setSaving] = useState(false);
  const [emailBody, setEmailBody] = useState(
    action === 'accept'
      ? `Dear ${application.full_name},

We are pleased to inform you that your application for the position of ${application.position} has been accepted!

Congratulations! Our team was impressed with your qualifications and experience. We believe you would be a great fit for our organization.

Next Steps:
- We will contact you shortly with more details about the position
- Please keep an eye on your inbox for further communication
- If you have any questions in the meantime, feel free to reach out

Thank you for your interest in joining our Digital Innovation Laboratory!

Best regards,
Digital Innovation Laboratory Team`
      : `Dear ${application.full_name},

Thank you for your interest in the position of ${application.position} at our organization.

We have carefully reviewed your application and qualifications. While we were impressed with your profile, we have decided to move forward with other candidates whose experience more closely matches our current needs.

We encourage you to apply for other opportunities in the future, and we wish you the best in your career endeavors.

Thank you for considering us!

Best regards,
Digital Innovation Laboratory Team`
  );
  const [error, setError] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    setSaving(true);
    setError(null);

    try {
      await onSuccess(action === 'accept' ? 'accepted' : 'rejected', emailBody);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {action === 'accept' ? 'Accept Application' : 'Reject Application'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Applicant Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Applicant Information:</p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{application.full_name}</span> - {application.position}
            </p>
            <p className="text-sm text-gray-600">{application.email}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            This message is emailed when SMTP is configured. The application status is updated either way.
          </div>

          {/* Email template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message to applicant:</label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleUpdateStatus}
              className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                action === 'accept'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {saving ? 'Saving...' : `Mark as ${action === 'accept' ? 'accepted' : 'rejected'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
