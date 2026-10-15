import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { api } from '@/lib/api';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  bucket: 'team-members' | 'news';
}

/** Strip path traversal sequences and keep only safe characters */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\]/g, '')          // no path separators
    .replace(/\.\./g, '')           // no traversal
    .replace(/[^a-zA-Z0-9._-]/g, '_') // only safe chars
    .slice(0, 100);                 // max length
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, bucket }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, GIF, WebP).');
      setUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5 MB.');
      setUploading(false);
      return;
    }

    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      const safeName = sanitizeFilename(file.name);
      const fileName = `${timestamp}-${random}-${safeName}`;

      const { data, error: uploadError } = await api.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = api.storage.from(bucket).getPublicUrl(data.path);
      onChange(urlData.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">
          {uploading ? (
            <span>Uploading...</span>
          ) : (
            <>
              Drag and drop your image here, or{' '}
              <label className="text-primary cursor-pointer hover:underline">
                click to browse
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP — max 5 MB</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
      )}

      {value && (
        <div className="relative inline-block w-full">
          <img src={value} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
