document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form');
  const fileInput = document.getElementById('file-input');
  const uploadStatus = document.getElementById('upload-status');
  const downloadSection = document.getElementById('download-section');
  const downloadButton = document.getElementById('download-button');
  const downloadStatus = document.getElementById('download-status');

  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];
    if (!file) return;

    uploadStatus.textContent = 'Uploading...';
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.message === 'File uploaded successfully!') {
        uploadStatus.textContent = 'Upload finished. Waiting for downloader...';
        checkForFile();
      } else {
        uploadStatus.textContent = result.message;
      }
    } catch (error) {
      uploadStatus.textContent = 'Upload failed.';
    }
  });

  const checkForFile = async () => {
    try {
      const response = await fetch('/.netlify/functions/check-file');
      const result = await response.json();
      if (result.fileExists) {
        document.getElementById('upload-section').style.display = 'none';
        downloadSection.style.display = 'block';
      }
    } catch (error) {
      console.error('Error checking for file:', error);
    }
  };

  downloadButton.addEventListener('click', async () => {
    downloadStatus.textContent = 'Downloading...';
    try {
      const response = await fetch('/.netlify/functions/download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'downloaded_file';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      downloadStatus.textContent = 'Download finished.';
      setTimeout(() => {
        location.reload();
      }, 2000);
    } catch (error) {
      downloadStatus.textContent = 'Download failed.';
    }
  });

  checkForFile();
});
