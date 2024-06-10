document.getElementById('upload-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const fileInput = document.getElementById('file-input');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    document.getElementById('message').innerText = result.message;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').innerText = 'An error occurred. Please try again.';
  }
});
