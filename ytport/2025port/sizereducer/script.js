const uploadBox = document.querySelector('.upload-box');
const fileInput = document.querySelector('#fileInput');
const previewImage = document.querySelector('#previewImage');
const widthInput = document.querySelector('#width');
const heightInput = document.querySelector('#height');
const ratioCheckbox = document.querySelector('#ratio');
const qualityCheckbox = document.querySelector('#quality');
const downloadBtn = document.querySelector('#downloadBtn');
const optimizeBtn = document.querySelector('#optimizeBtn');
const targetSizeInput = document.querySelector('#targetSize');
const originalSizeElement = document.querySelector('#originalSize');
const currentSizeElement = document.querySelector('#currentSize');
const reductionElement = document.querySelector('#reduction');
const formatDescription = document.querySelector('#formatDescription');
const qualityControl = document.getElementById('qualityControl');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const qualityDescription = document.getElementById('qualityDescription');
const qualityPresets = document.querySelectorAll('.quality-preset');
const qualityInfoIcon = document.querySelector('.quality-info-icon');
const qualityTips = document.getElementById('qualityTips');

let originalImageRatio;
let originalFileSize = 0;

// Format descriptions
const formatDescriptions = {
    jpg: 'JPG: Best for photographs, smaller file size',
    png: 'PNG: Best for graphics with transparency, larger file size',
    pdf: 'PDF: Best for documents, maintains quality, good for printing'
};

// Handle format selection
document.querySelectorAll('input[name="format"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        formatDescription.textContent = formatDescriptions[e.target.value];
        // Disable quality checkbox for PDF
        qualityCheckbox.disabled = e.target.value === 'pdf';
        if (e.target.value === 'pdf') {
            qualityCheckbox.checked = false;
        }
    });
});

// Format file size with clear units
function formatFileSize(bytes) {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
}

// Update size information with detailed display
function updateSizeInfo(currentSize) {
    const reduction = ((originalFileSize - currentSize) / originalFileSize * 100).toFixed(1);
    
    // Format sizes with clear units
    const originalFormatted = formatFileSize(originalFileSize);
    const currentFormatted = formatFileSize(currentSize);
    
    // Update the display elements
    originalSizeElement.textContent = originalFormatted;
    currentSizeElement.textContent = currentFormatted;
    reductionElement.textContent = `${reduction}% smaller`;
    
    // Add color coding for reduction
    if (reduction > 50) {
        reductionElement.style.color = '#48bb78'; // Green for good reduction
    } else if (reduction > 20) {
        reductionElement.style.color = '#ecc94b'; // Yellow for moderate reduction
    } else {
        reductionElement.style.color = '#f56565'; // Red for low reduction
    }
}

// Handle file upload
uploadBox.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file!');
        return;
    }

    originalFileSize = file.size;
    updateSizeInfo(originalFileSize);

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.onload = () => {
            widthInput.value = previewImage.naturalWidth;
            heightInput.value = previewImage.naturalHeight;
            originalImageRatio = previewImage.naturalWidth / previewImage.naturalHeight;
            downloadBtn.disabled = false;
            optimizeBtn.disabled = false;
        };
    };
    reader.readAsDataURL(file);
});

// Maintain aspect ratio
function updateDimensions(input) {
    if (!ratioCheckbox.checked) return;
    
    if (input === widthInput) {
        heightInput.value = Math.round(widthInput.value / originalImageRatio);
    } else {
        widthInput.value = Math.round(heightInput.value * originalImageRatio);
    }
}

widthInput.addEventListener('input', () => updateDimensions(widthInput));
heightInput.addEventListener('input', () => updateDimensions(heightInput));

// Get selected format
function getSelectedFormat() {
    return document.querySelector('input[name="format"]:checked').value;
}

// Get MIME type for format
function getMimeType(format) {
    const mimeTypes = {
        jpg: 'image/jpeg',
        png: 'image/png',
        pdf: 'application/pdf'
    };
    return mimeTypes[format];
}

// Convert image to PDF
async function convertToPDF(canvas) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    return pdf;
}

// Optimize to target size
async function optimizeToTargetSize() {
    const targetSize = targetSizeInput.value * 1024; // Convert KB to bytes
    if (!targetSize || targetSize <= 0) {
        alert('Please enter a valid target size!');
        return;
    }

    optimizeBtn.textContent = 'Optimizing...';
    optimizeBtn.disabled = true;

    let quality = 1.0;
    let currentSize = originalFileSize;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;
    
    const format = getSelectedFormat();
    
    if (format === 'pdf') {
        ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
        const pdf = await convertToPDF(canvas);
        const pdfData = pdf.output('arraybuffer');
        currentSize = pdfData.byteLength;
        updateSizeInfo(currentSize);
        optimizeBtn.textContent = 'Optimize to Target Size';
        optimizeBtn.disabled = false;
        return;
    }

    // Binary search for optimal quality (for image formats)
    let min = 0.1;
    let max = 1.0;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        quality = (min + max) / 2;
        ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL(getMimeType(format), quality);
        currentSize = Math.round((dataUrl.length - 22) * 3 / 4);
        
        if (Math.abs(currentSize - targetSize) < 1024) { // Within 1KB of target
            break;
        }
        
        if (currentSize > targetSize) {
            max = quality;
        } else {
            min = quality;
        }
        
        attempts++;
    }

    updateSizeInfo(currentSize);
    qualityCheckbox.checked = true;
    
    // Show optimization result
    const targetFormatted = formatFileSize(targetSize);
    const achievedFormatted = formatFileSize(currentSize);
    alert(`Optimization complete!\nTarget: ${targetFormatted}\nAchieved: ${achievedFormatted}\nQuality: ${(quality * 100).toFixed(0)}%\nFormat: ${format.toUpperCase()}`);
    
    optimizeBtn.textContent = 'Optimize to Target Size';
    optimizeBtn.disabled = false;
}

optimizeBtn.addEventListener('click', optimizeToTargetSize);

// Download resized image
downloadBtn.addEventListener('click', async () => {
    try {
        if (!previewImage.src) {
            alert('Please upload an image first!');
            return;
        }

        // Validate dimensions
        if (!widthInput.value || !heightInput.value) {
            alert('Please enter valid width and height values!');
            return;
        }

        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        
        // Draw image with proper scaling
        ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
        
        const format = getSelectedFormat();
        let blob;
        let currentSize;

        if (format === 'pdf') {
            try {
                const pdf = await convertToPDF(canvas);
                const pdfData = pdf.output('arraybuffer');
                blob = new Blob([pdfData], { type: 'application/pdf' });
                currentSize = pdfData.byteLength;
            } catch (error) {
                console.error('PDF conversion error:', error);
                alert('Error converting to PDF. Please try again.');
                downloadBtn.textContent = 'Download';
                downloadBtn.disabled = false;
                return;
            }
        } else {
            const quality = qualityCheckbox.checked ? 0.7 : 1.0;
            blob = await new Promise(resolve => {
                canvas.toBlob(resolve, getMimeType(format), quality);
            });
            currentSize = blob.size;
        }

        updateSizeInfo(currentSize);
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resized-image.${format}`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);

        // Show success message
        const formatName = format.toUpperCase();
        alert(`Successfully downloaded as ${formatName} file!`);
    } catch (error) {
        console.error('Download error:', error);
        alert('Error during download. Please try again.');
    } finally {
        downloadBtn.textContent = 'Download';
        downloadBtn.disabled = false;
    }
});

// Add drag and drop support
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('active');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('active');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('active');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    } else {
        alert('Please drop an image file!');
    }
});

// Show/hide quality slider when checkbox is toggled
qualityCheckbox.addEventListener('change', () => {
    qualityControl.style.display = qualityCheckbox.checked ? 'block' : 'none';
    if (qualityCheckbox.checked) {
        updateQualityDisplay(parseInt(qualitySlider.value));
    }
});

// Toggle quality tips
qualityInfoIcon.addEventListener('click', () => {
    qualityTips.style.display = qualityTips.style.display === 'none' ? 'block' : 'none';
});

const qualityDescriptions = {
    100: "High quality - Best for important photos and documents",
    80: "Medium quality - Good for general purpose images",
    60: "Low quality - Suitable for web images and thumbnails",
    40: "Very low quality - Maximum compression for small file size"
};

// Update quality value display and description
function updateQualityDisplay(value) {
    qualityValue.textContent = `${value}%`;
    qualitySlider.value = value;
    
    // Find the closest preset
    const presets = Array.from(qualityPresets).map(preset => parseInt(preset.dataset.quality));
    const closestPreset = presets.reduce((prev, curr) => {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
    
    // Update description
    qualityDescription.textContent = qualityDescriptions[closestPreset];
    
    // Update active preset
    qualityPresets.forEach(preset => {
        if (parseInt(preset.dataset.quality) === closestPreset) {
            preset.classList.add('active');
        } else {
            preset.classList.remove('active');
        }
    });

    // Update tooltips
    qualityPresets.forEach(preset => {
        const value = parseInt(preset.dataset.quality);
        preset.title = qualityDescriptions[value];
    });
}

// Handle quality slider input
qualitySlider.addEventListener('input', () => {
    updateQualityDisplay(parseInt(qualitySlider.value));
});

// Handle quality preset clicks
qualityPresets.forEach(preset => {
    preset.addEventListener('click', () => {
        const value = parseInt(preset.dataset.quality);
        updateQualityDisplay(value);
    });
});

// Initialize quality display
updateQualityDisplay(80);

// Update the processImage function to use quality value
async function processImage() {
    if (!file) return;
    
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const maintainRatio = document.getElementById('ratio').checked;
    const reduceQuality = document.getElementById('quality').checked;
    const quality = reduceQuality ? parseInt(qualitySlider.value) / 100 : 1;
    const format = document.querySelector('input[name="format"]:checked').value;
    
    if (!width || !height) {
        alert('Please enter both width and height');
        return;
    }

    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        await new Promise((resolve) => {
            img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (maintainRatio) {
            const ratio = Math.min(width / img.width, height / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let processedFile;
        if (format === 'pdf') {
            const pdf = new jspdf.jsPDF();
            pdf.addImage(canvas.toDataURL('image/jpeg', quality), 'JPEG', 0, 0, 210, 297);
            processedFile = pdf.output('blob');
        } else {
            processedFile = await new Promise(resolve => {
                canvas.toBlob(resolve, `image/${format}`, quality);
            });
        }

        // Update size information
        const originalSize = file.size;
        const currentSize = processedFile.size;
        const reduction = ((originalSize - currentSize) / originalSize * 100).toFixed(1);

        document.getElementById('originalSize').textContent = formatFileSize(originalSize);
        document.getElementById('currentSize').textContent = formatFileSize(currentSize);
        document.getElementById('reduction').textContent = `${reduction}% smaller`;

        // Enable download button
        downloadBtn.disabled = false;
        downloadBtn.onclick = () => downloadFile(processedFile, format);
    } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
    }
} 