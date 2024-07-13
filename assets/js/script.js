document.addEventListener("DOMContentLoaded", function () {
  const btnNuevoVideo = document.querySelector(".btn_nuevo_video");
  const videoGaleria = document.querySelector(".video_galeria");
  const editModal = document.getElementById("editModal");
  const spanClose = document.querySelector(".close");
  const saveChangesButton = document.getElementById("saveChanges");
  const limpiarButton = document.getElementById("limpiarChanges");
  const imageError = document.getElementById("imageError");
  let currentCard = null;
  let isEditMode = false;

  // Función para agregar un nuevo video
  function agregarVideo(url, title, category, description, imageSrc) {
    const nuevaCard = document.createElement("div");
    nuevaCard.className = "card";
    nuevaCard.dataset.category = category;
    nuevaCard.innerHTML = `
            <iframe width="700" height="315" src="${url}" title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <h3>${title}</h3>
            <p>${description}</p>
            <img class="icono_borrar" src="/assets/img/borrar.png" alt="">
            <img class="icono_editar" src="/assets/img/editar.png" alt="">
        `;
    const categoriaSection = document.querySelector(`.${category}`);
    categoriaSection.appendChild(nuevaCard);

    // Agregar eventos a los nuevos botones de borrar y editar
    nuevaCard
      .querySelector(".icono_borrar")
      .addEventListener("click", borrarVideo);
    nuevaCard
      .querySelector(".icono_editar")
      .addEventListener("click", editarVideo);
  }

  // Función para borrar un video
  function borrarVideo(event) {
    const card = event.target.closest(".card");
    card.remove();
  }

  // Función para abrir el modal de edición
  function editarVideo(event) {
    isEditMode = true;
    currentCard = event.target.closest(".card");
    const videoTitle = document.getElementById("videoTitle");
    const videoCategory = document.getElementById("videoCategory");
    const videoDescription = document.getElementById("videoDescription");
    const videoImage = document.getElementById("videoImage");

    // Asignar valores actuales al formulario del modal
    videoTitle.value = currentCard.querySelector("h3")
      ? currentCard.querySelector("h3").textContent
      : "";
    videoCategory.value = currentCard.dataset.category || "frontend";
    videoDescription.value = currentCard.querySelector("p")
      ? currentCard.querySelector("p").textContent
      : "";
    videoImage.value = "";

    editModal.style.display = "block";
  }

  // Evento para abrir el modal de nuevo video
  btnNuevoVideo.addEventListener("click", function () {
    isEditMode = false;
    currentCard = null;
    const videoTitle = document.getElementById("videoTitle");
    const videoCategory = document.getElementById("videoCategory");
    const videoDescription = document.getElementById("videoDescription");
    const videoImage = document.getElementById("videoImage");

    // Limpiar valores del formulario del modal
    videoTitle.value = "";
    videoCategory.value = "frontend";
    videoDescription.value = "";
    videoImage.value = "";

    editModal.style.display = "block";
  });

  // Evento para cerrar el modal
  spanClose.onclick = function () {
    editModal.style.display = "none";
  };

  // Evento para cerrar el modal si se hace clic fuera de él
  window.onclick = function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  };

  // Evento para limpiar el formulario del modal
  limpiarButton.addEventListener("click", function () {
    const videoTitle = document.getElementById("videoTitle");
    const videoCategory = document.getElementById("videoCategory");
    const videoDescription = document.getElementById("videoDescription");
    const videoImage = document.getElementById("videoImage");

    videoTitle.value = "";
    videoCategory.value = "frontend";
    videoDescription.value = "";
    videoImage.value = "";
  });

  // Evento para validar y guardar cambios
  saveChangesButton.addEventListener("click", function () {
    const videoTitle = document.getElementById("videoTitle").value;
    const videoCategory = document.getElementById("videoCategory").value;
    const videoDescription = document.getElementById("videoDescription").value;
    const videoImage = document.getElementById("videoImage").files[0];
    const videoUrl = prompt("Ingrese la URL del video:");

    if (!videoImage || !videoImage.type.startsWith("image/")) {
      imageError.style.display = "block";
      return;
    } else {
      imageError.style.display = "none";
    }

    // Crear una URL para la imagen
    const imageSrc = URL.createObjectURL(videoImage);

    // Si estamos en modo de edición, actualizar la card existente
    if (isEditMode && currentCard) {
      let titleElement = currentCard.querySelector("h3");
      if (!titleElement) {
        titleElement = document.createElement("h3");
        currentCard.insertBefore(titleElement, currentCard.firstChild);
      }
      titleElement.textContent = videoTitle;

      let descriptionElement = currentCard.querySelector("p");
      if (!descriptionElement) {
        descriptionElement = document.createElement("p");
        currentCard.appendChild(descriptionElement);
      }
      descriptionElement.textContent = videoDescription;

      currentCard.dataset.category = videoCategory;
      // Aquí puedes manejar la actualización de la imagen según tus necesidades.
    } else {
      // Si no estamos en modo de edición, agregar un nuevo video
      agregarVideo(
        videoUrl,
        videoTitle,
        videoCategory,
        videoDescription,
        imageSrc
      );
    }

    editModal.style.display = "none";
  });

  // Agregar eventos a los botones de borrar y editar existentes
  const iconosBorrar = document.querySelectorAll(".icono_borrar");
  const iconosEditar = document.querySelectorAll(".icono_editar");
  iconosBorrar.forEach((icono) => icono.addEventListener("click", borrarVideo));
  iconosEditar.forEach((icono) => icono.addEventListener("click", editarVideo));
});
