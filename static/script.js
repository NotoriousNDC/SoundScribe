document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setButtonState(true);

    removeExistingSpinner();
    showSpinner();

    fetch('/transcribe', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.transcript) {
            displayTranscriptionResult(data.transcript);
        } else {
            throw new Error('No transcription result in the response');
        }
    })
    .catch(error => {
        displayError(error.message);
    })
    .finally(() => {
        setButtonState(false);
        hideSpinner();
    });
}


function setButtonState(isDisabled) {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = isDisabled;
    submitButton.textContent = isDisabled ? 'Transcribing...' : 'Transcribe';
}

function showSpinner() {
    const spinnerContainer = createSpinnerContainer();
    const form = document.getElementById('uploadForm');
    form.appendChild(spinnerContainer); // Append the spinner container to the form
}

function createSpinnerContainer() {
    const spinnerContainer = document.createElement('div');
    spinnerContainer.id = 'spinnerContainer';
    spinnerContainer.style.display = 'flex'; // Display as flex to center the spinner
    spinnerContainer.style.justifyContent = 'center';
    spinnerContainer.style.alignItems = 'center';
    spinnerContainer.style.height = '100px';

    const spinner = document.createElement('img');
    spinner.src = '/static/loading_spinner.gif'; // Ensure this path is correct.
    spinner.alt = 'Loading...';
    spinner.id = 'loadingSpinner';
    spinner.style.width = '50px'; // Adjust size as needed
    spinner.style.height = '50px'; // Adjust size as needed

    spinnerContainer.appendChild(spinner);
    return spinnerContainer;
}


function hideSpinner() {
    // Instead of removing the spinner container, you can simply hide it. This prevents potential issues if the DOM element is accessed after removal.
    const spinnerContainer = document.getElementById('spinnerContainer');
    if (spinnerContainer) {
        spinnerContainer.style.display = 'none'; // Hide the spinner container
    }
}

function removeExistingSpinner() {
    const existingSpinner = document.getElementById('loadingSpinner');
    if (existingSpinner) {
        existingSpinner.remove();
    }
}

function displayTranscriptionResult(transcript) {
    const resultContainer = document.getElementById('transcriptionResult');
    resultContainer.innerText = transcript;
    // Add ARIA updates if necessary, e.g., resultContainer.setAttribute('aria-live', 'polite');
}

function displayError(errorMessage) {
    const resultContainer = document.getElementById('transcriptionResult');
    resultContainer.textContent = errorMessage;
    resultContainer.classList.add('error'); // Make sure you define an 'error' class in your CSS
}
