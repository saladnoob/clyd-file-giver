function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const downloadUrl = document.getElementById('download-url');
            downloadUrl.href = data.url;
            document.getElementById('download-link').classList.remove('hidden');
        } else {
            alert('File upload failed.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
