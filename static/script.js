document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    
    // Disable the button and show a loading icon
    var submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Transcribing...'; // Change the button text to indicate loading
    // Optionally, add a loading spinner
    var spinner = document.createElement('img');
    spinner.src = 'loading-spinner.gif'; // Add the path to your loading spinner GIF
    spinner.alt = 'Loading...';
    submitButton.parentNode.insertBefore(spinner, submitButton.nextSibling);

    fetch('/transcribe', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('transcriptionResult').innerText = data.transcript;
        // Re-enable the button and remove the loading icon after the fetch is complete
        submitButton.disabled = false;
        submitButton.textContent = 'Transcribe'; // Reset button text
        spinner.remove(); // Remove the loading spinner
    })
    .catch(error => {
        console.error('Error:', error);
        submitButton.disabled = false;
        submitButton.textContent = 'Transcribe'; // Reset button text on error
        spinner.remove(); // Remove the loading spinner on error
    });
});
