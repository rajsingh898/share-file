const uploadForm = document.getElementById('uploadForm');
const responseMessage = document.getElementById('responseMessage');
const apiBaseUrl = "http://localhost:5000";

// Check if there's a message in session storage and display it
if (sessionStorage.getItem('uploadMessage')) {
    responseMessage.innerText = sessionStorage.getItem('uploadMessage');
    responseMessage.style.color = sessionStorage.getItem('uploadMessageColor');

    sessionStorage.removeItem('uploadMessage');
    sessionStorage.removeItem('uploadMessageColor');
}

// Handle form submission for file upload
uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();  // Prevent the default form refresh behavior
    
    responseMessage.innerText = 'Uploading file... Please wait.';
    responseMessage.style.color = 'blue';

    const formData = new FormData();
    const fileInput = document.getElementById('file');
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch(`${apiBaseUrl}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            const message = `File uploaded successfully! Use this pin: ${data.pin}`;
            responseMessage.innerText = message;
            responseMessage.style.color = 'green';

            // Store message in session storage
            sessionStorage.setItem('uploadMessage', message);
            sessionStorage.setItem('uploadMessageColor', 'green');
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        responseMessage.innerText = 'Error uploading file. Please try again.';
        responseMessage.style.color = 'red';

        // Store error message in session storage
        sessionStorage.setItem('uploadMessage', 'Error uploading file. Please try again.');
        sessionStorage.setItem('uploadMessageColor', 'red');
    }
});

function downloadFile() {
    const pin = document.getElementById('pin').value;

    if (!pin) {
        alert('Please enter a pin to download the file.');
        return;
    }

    fetch(`${apiBaseUrl}/download/${pin}`)
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('File not found or invalid pin');
            }
        })
        .then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded-file';
            link.click();
        })
        .catch((error) => {
            alert(error.message);
        });
}
