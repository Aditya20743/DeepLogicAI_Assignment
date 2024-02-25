import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      console.log('Extracted Data:', data.data);
      setExtractedData(data.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <input type="file" name="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {extractedData && (
        <div className="extracted-data">
          <h2>Extracted Data:</h2>
          <pre>{extractedData}</pre>
        </div>
      )}

      <style jsx>{`
        .extracted-data {
          padding: 20px;
          border: 1px solid #ccc;
          margin-top: 20px;
        }

        pre {
          white-space: pre-wrap;
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </div>
  );
}

export default App;
