let currentPage = 4;
let totalPages = 5;
let photos = [];
let selectPhoto = null;

async function buscar() {
    const earthDate = document.getElementById('fecha').value;
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${earthDate}&api_key=MHg05QymjFcc457syw8T56z0ZV49jrDjK40bIBle`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        photos = data.photos;

        totalPages = Math.ceil(photos.length / 25);
        currentPage = 1;
        actualizarBotones();
        mostrarFotos();

        if (photos.length > 0) {
            seleccionarFoto(photos[0]);
        }
    } catch (error) {
        console.error("Error al buscar las fotos:", error);
    }
}

function mostrarFotos() {
    const tabla = document.getElementById('table_results');
    const tableBody = document.getElementById('cuerpo_t');
    if (tableBody) {
        tableBody.remove();
    }

    const tblBody = document.createElement("tbody");
    tblBody.setAttribute("id", "cuerpo_t");

    const start = (currentPage - 1) * 25;
    const end = start + 25;
    const photosToShow = photos.slice(start, end);

    photosToShow.forEach(photo => {
        const row = document.createElement("tr");

        const celdaId = document.createElement("td");
        celdaId.textContent = photo.id;
        row.appendChild(celdaId);

        const celdaRoverName = document.createElement("td");
        celdaRoverName.textContent = photo.rover.name;
        row.appendChild(celdaRoverName);

        const celdaCamera = document.createElement("td");
        celdaCamera.textContent = photo.camera.name;
        row.appendChild(celdaCamera);

        const celdaDetails = document.createElement("td");
        const buttonDetails = document.createElement("button");
        buttonDetails.setAttribute("class", "btn-ver");
        buttonDetails.textContent = "More";
        buttonDetails.onclick = () => seleccionarFoto(photo);
        celdaDetails.appendChild(buttonDetails);
        row.appendChild(celdaDetails);

        tblBody.appendChild(row);
    });
    tabla.appendChild(tblBody);
    if (photosToShow.length > 0) {
        seleccionarFoto(photosToShow[0]);
    }
}

function seleccionarFoto(photo) {
    selectPhoto = photo;
    mostrarMasDetalles();
}

function mostrarMasDetalles() {
    if (!selectPhoto) return;
    const selectPhotoDiv = document.getElementById('select_photo');
    selectPhotoDiv.innerHTML = `<img src="${selectPhoto.img_src}" alt="Select Mars Photo">`;
    document.getElementById('photo_id').textContent = `ID: ${selectPhoto.id}`;
    document.getElementById('martian_sol').textContent = `Martian Sol: ${selectPhoto.sol}`;
    document.getElementById('earth_date').textContent = `Earth Date: ${selectPhoto.earth_date}`;
}

function cambiarPagina(direccion) {
    currentPage += direccion;
    mostrarFotos();
    actualizarBotones();
}

function actualizarBotones() {
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

document.addEventListener('DOMContentLoaded', function() {
    buscar();
});