import QrScanner from '../node_modules/qr-scanner/qr-scanner.min.js';

const fileInput = document.getElementById('image');
const resultDiv = document.getElementById('result');
const cameraButton = document.getElementById('camera-on');

cameraButton.addEventListener("click", e=>{
    cameraButton.style.display = 'none';

    const videoElement = document.createElement('video');
    document.querySelector(`#videos`).appendChild(videoElement);
    const qrScanner = new QrScanner(videoElement, result => {
        if (/^https?:\/\/.*/.test(result)) resultDiv.innerHTML = `<a href="${result}" target="_blank">${result}</a>`;
        else resultDiv.innerHTML = result;
        resultDiv.scrollIntoView();
    });
    qrScanner.start();

});

fileInput.addEventListener("input", async e=>{
    const result = await QrScanner.scanImage(fileInput.files?.[0]);
    if (/^https?:\/\/.*/.test(result)) resultDiv.innerHTML = `<a href="${result}" target="_blank">${result}</a>`;
    else resultDiv.innerHTML = result;
});

window.addEventListener("paste", e=>{
    fileInput.files = e.clipboardData.files;
    fileInput.dispatchEvent(new Event('input'));
});
