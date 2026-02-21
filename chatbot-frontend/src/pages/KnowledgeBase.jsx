import { useState } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { uploadDocs, updateDocs } from '../services/api/chat.service';
import Navbar from '../components/Navbar';

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [textData, setTextData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');
    
    if (file) {
      const validTypes = ['text/plain', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Only .txt and .pdf files allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError('');
    try {
      await uploadDocs(selectedFile);
      toast.success('File uploaded successfully!');
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textData.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await updateDocs({"content":textData});
      toast.success('Data updated successfully!');
      setTextData('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="knowledge-base-container">
      <Navbar />

      <div className="knowledge-content">
        <div className="knowledge-card">
          <h2>Feed Data</h2>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('upload');
                setError('');
              }}
            >
              <FiUpload />
              Upload File
            </button>
            <button
              className={`tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('text');
                setError('');
              }}
            >
              <FiFile />
              Add Text
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'upload' ? (
              <div className="upload-section">
                <input
                  type="file"
                  id="file-input"
                  accept=".txt,.pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                {!selectedFile ? (
                  <label htmlFor="file-input" className="upload-box">
                    <FiUpload className="upload-icon" />
                    <p>Select file</p>
                    <span>.txt or .pdf (max 10MB)</span>
                  </label>
                ) : (
                  <div className="file-preview">
                    <FiFile />
                    <div className="file-info">
                      <p>{selectedFile.name}</p>
                      <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button className="remove-btn" onClick={() => setSelectedFile(null)}>
                      <FiX />
                    </button>
                  </div>
                )}

                {error && <p className="error-msg">{error}</p>}

                <button
                  className="submit-btn"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            ) : (
              <div className="text-section">
                <textarea
                  className="text-input"
                  placeholder="Enter text data..."
                  value={textData}
                  onChange={(e) => setTextData(e.target.value)}
                  maxLength={5000}
                />
                
                {error && <p className="error-msg">{error}</p>}

                <div className="text-footer">
                  <span className="char-count">{textData.length} / 5000</span>
                  <button
                    className="submit-btn"
                    onClick={handleTextSubmit}
                    disabled={!textData.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
