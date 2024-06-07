import QrScanner from 'qr-scanner';
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
/** https://scanapp.org/html5-qrcode-docs/docs/intro */

const QRCodeScanner = new Html5Qrcode("reader");

const fileInput = document.getElementById('image');
const resultDiv = document.getElementById('result');
const cameraButton = document.getElementById('camera-on');

cameraButton.addEventListener("click", e=>{
    cameraButton.style.display = 'none';
    const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: {
            width: 800,
            height: 800
        }
    });
    scanner.render((decodedText, decodedResult) => {
        if (/^https?:\/\/.*/.test(decodedText)) resultDiv.innerHTML = `<a href="${decodedText}" target="_blank">${decodedText}</a>`;
        else {
            const elem = document.createElement(`span`);
            elem.innerText = decodedText
            resultDiv.innerHTML = '';
            resultDiv.appendChild(elem);
        }
        resultDiv.scrollIntoView();
    }, (error) => {console.warn(`Code scan error = ${error}`);})
});

fileInput.addEventListener("input", async e=>{
    try {
        const result = await QrScanner.scanImage(fileInput.files?.[0]);
        if (/^https?:\/\/.*/.test(result)) resultDiv.innerHTML = `<a href="${result}" target="_blank">${result}</a>`;
        else {
            const elem = document.createElement(`span`);
            elem.innerText = result
            resultDiv.innerHTML = '';
            resultDiv.appendChild(elem);
        }

        const imgElement = (document.querySelector(`img#image`) || document.createElement(`img`));
        imgElement.id = 'image';
        document.querySelector`div#image`.appendChild(imgElement);

        imgElement.src = URL.createObjectURL(fileInput.files[0]);
    }
    catch(err) {
        if (err == 'Unsupported image type.') {
            alert("Invalid Input. Please input the right image.");
        }
        else if (err == 'No QR code found') {
            console.log(err);
            const imgElement = (document.querySelector(`img#image`) || document.createElement(`img`));
            imgElement.id = 'image';
            document.querySelector`div#image`.appendChild(imgElement);

            imgElement.src = URL.createObjectURL(fileInput.files[0]);
            try {
                const res2 = await QRCodeScanner.scanFile(fileInput.files?.[0]);
                if (/^https?:\/\/.*/.test(res2)) resultDiv.innerHTML = `<a href="${res2}" target="_blank">${res2}</a>`;
                else {
                    const elem = document.createElement(`span`);
                    elem.innerText = res2
                    resultDiv.innerHTML = '';
                    resultDiv.appendChild(elem);
                }
                console.log(res2);
            }
            catch(err) {
                alert("No QR code found. Please input the right image.");
            }
        }
        else console.error(err);
    }
});

window.addEventListener("paste", e=>{
    fileInput.files = e.clipboardData.files;
    fileInput.dispatchEvent(new Event('input'));

});
