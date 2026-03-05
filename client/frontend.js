const uploadForm = document.getElementById("uploadForm");
const responseMessage = document.getElementById("responseMessage");

const apiBaseUrl = "https://share-file-gamma.vercel.app";

uploadForm.addEventListener("submit", async (e) => {

e.preventDefault();

responseMessage.textContent = "Uploading...";
responseMessage.style.color = "#4f46e5";

const formData = new FormData();
formData.append("file", document.getElementById("file").files[0]);

try {

const res = await fetch(`${apiBaseUrl}/upload`, {
method: "POST",
body: formData
});

if (!res.ok) throw new Error();

const data = await res.json();

responseMessage.style.display = "block";
responseMessage.innerHTML = "Upload failed. Please try again.";
responseMessage.style.background = "#fee2e2";
responseMessage.style.border = "2px solid #dc2626";
responseMessage.style.color = "#991b1b";

}
catch {

responseMessage.style.display = "block";
responseMessage.innerHTML = "Upload failed. Please try again.";
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
a.download = filename;   // 👈 real filename
document.body.appendChild(a);

a.click();

URL.revokeObjectURL(url);
a.remove();

})
.catch(err => alert(err.message));

}
