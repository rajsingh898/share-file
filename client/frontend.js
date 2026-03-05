const uploadForm = document.getElementById("uploadForm");
const responseMessage = document.getElementById("responseMessage");

const apiBaseUrl = "https://share-file-gamma.vercel.app";

uploadForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    responseMessage.style.display = "block";
    responseMessage.textContent = "Uploading...";
    responseMessage.style.background = "#eef2ff";
    responseMessage.style.border = "1px solid #4f46e5";
    responseMessage.style.color = "#4f46e5";

    const fileInput = document.getElementById("file");

    if (!fileInput.files[0]) {
        responseMessage.textContent = "Please select a file.";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {

        const res = await fetch(`${apiBaseUrl}/upload`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        const data = await res.json();

        responseMessage.innerHTML = `
<div style="font-size:13px;margin-bottom:6px;color:#15803d">
Download PIN
</div>
<div style="font-size:22px;font-weight:700;letter-spacing:2px;">
${data.pin}
</div>
`;

        responseMessage.style.background = "#ecfdf5";
        responseMessage.style.border = "2px solid #16a34a";
        responseMessage.style.color = "#166534";

    } catch (error) {

        responseMessage.textContent = "Upload failed. Please try again.";
        responseMessage.style.background = "#fee2e2";
        responseMessage.style.border = "2px solid #dc2626";
        responseMessage.style.color = "#991b1b";

    }

});


function downloadFile() {

    const pin = document.getElementById("pin").value.trim();

    if (!pin) {
        alert("Please enter a PIN");
        return;
    }

    fetch(`${apiBaseUrl}/download/${pin}`)
    .then(response => {

        if (!response.ok) {
            throw new Error("Invalid PIN");
        }

        const disposition = response.headers.get("content-disposition");

        let filename = "file";

        if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/"/g, "");
        }

        return response.blob().then(blob => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        a.remove();

    })
    .catch(err => alert(err.message));

}
