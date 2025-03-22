        let currentImageUrl = '';

        window.onload = function() {
            const savedImages = JSON.parse(localStorage.getItem("imageData")) || [];
            savedImages.forEach(data => createImageElement(data.url, data.description));
        }

        function addImage() {
            const urlInput = document.getElementById("image-url");
            const imageUrl = urlInput.value;
            if (imageUrl) {
                createImageElement(imageUrl, "");
                const savedImages = JSON.parse(localStorage.getItem("imageData")) || [];
                savedImages.push({ url: imageUrl, description: "" });
                localStorage.setItem("imageData", JSON.stringify(savedImages));
                urlInput.value = "";
            } else {
                alert("Please enter a valid image URL.");
            }
        }

        function createImageElement(url, description) {
            const gallery = document.getElementById("gallery");
            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container";

            const img = document.createElement("img");
            img.src = url;
            img.alt = "Gallery Image";
            img.onclick = () => openZoomedImage(url);

            const desc = document.createElement("p");
            desc.className = "description";
            desc.innerText = description || "";

            const addDescBtn = document.createElement("button");
            addDescBtn.className = "add-desc-btn";
            addDescBtn.innerText = "Add Description";
            addDescBtn.onclick = () => openDescriptionModal(url, desc);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.innerText = "Delete";
            deleteBtn.onclick = () => {
                deleteImage(url);
                imageContainer.remove();
            };

            const shareBtn = document.createElement("button");
            shareBtn.className = "share-btn";
            shareBtn.innerText = "Share";
            shareBtn.onclick = () => openShareModal(url);

            imageContainer.appendChild(img);
            imageContainer.appendChild(desc);
            imageContainer.appendChild(addDescBtn);
            imageContainer.appendChild(deleteBtn);
            imageContainer.appendChild(shareBtn);
            gallery.appendChild(imageContainer);
        }

        function openZoomedImage(url) {
            document.getElementById("zoomedImageContent").src = url;
            document.getElementById("zoomedImage").style.display = "flex";
        }

        function closeZoomedImage() {
            document.getElementById("zoomedImage").style.display = "none";
        }

        function openDescriptionModal(url, descElement) {
            currentImageUrl = url;
            document.getElementById("descInput").value = descElement.innerText;
            document.getElementById("descriptionModal").style.display = "flex";
        }

        function saveDescription() {
            const newDescription = document.getElementById("descInput").value;
            const savedImages = JSON.parse(localStorage.getItem("imageData")) || [];
            const imageIndex = savedImages.findIndex(data => data.url === currentImageUrl);
            if (imageIndex !== -1) {
                savedImages[imageIndex].description = newDescription;
                localStorage.setItem("imageData", JSON.stringify(savedImages));
                document.querySelector(`img[src="${currentImageUrl}"]`).nextElementSibling.innerText = newDescription;
            }
            document.getElementById("descriptionModal").style.display = "none";
        }

        function deleteImage(url) {
            let savedImages = JSON.parse(localStorage.getItem("imageData")) || [];
            savedImages = savedImages.filter(data => data.url !== url);
            localStorage.setItem("imageData", JSON.stringify(savedImages));
        }

        function openShareModal(url) {
    document.getElementById("shareLinkInput").value = url;
    document.getElementById("shareModal").style.display = "flex";
}

function closeShareModal() {
    document.getElementById("shareModal").style.display = "none";
}

function copyShareLink() {
    const shareLinkInput = document.getElementById("shareLinkInput");
    shareLinkInput.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}

        /* Search Functionality */
        function toggleSearchBar() {
            const searchBar = document.getElementById("search-bar");
            searchBar.classList.toggle("active");
            if (searchBar.classList.contains("active")) {
                searchBar.focus();
            }
        }

        function searchImages() {
            const searchTerm = document.getElementById("search-bar").value.toLowerCase();
            const imageContainers = document.querySelectorAll(".image-container");

            imageContainers.forEach(container => {
                const description = container.querySelector(".description").innerText.toLowerCase();
                if (description.includes(searchTerm)) {
                    container.style.display = "block";
                } else {
                    container.style.display = "none";
                }
            });
        }

        /* Drag and Drop Functionality */
        function openDropModal() {
            document.getElementById("dropModal").style.display = "flex";
        }

        function closeDropModal() {
            document.getElementById("dropModal").style.display = "none";
        }

        const dropZone = document.getElementById("dropZone");

        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("dragover");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("dragover");
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("dragover");

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    createImageElement(imageUrl, "");
                    const savedImages = JSON.parse(localStorage.getItem("imageData")) || [];
                    savedImages.push({ url: imageUrl, description: "" });
                    localStorage.setItem("imageData", JSON.stringify(savedImages));
                    closeDropModal();
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please drop a valid image file.");
            }
        });
        // Handle file input change
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;
            createImageElement(imageUrl, "");
            const savedImages = JSON.parse(localStorage.getItem("imageData")) || [];
            savedImages.push({ url: imageUrl, description: "" });
            localStorage.setItem("imageData", JSON.stringify(savedImages));
            closeDropModal();
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
});
