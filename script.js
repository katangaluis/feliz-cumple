document.addEventListener("DOMContentLoaded", () => {
  const puzzleBox = document.getElementById("puzzleBox");
  const polaroidContainer = document.getElementById("polaroidContainer");
  const scene = document.querySelector(".scene");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const carouselControls = document.getElementById("carouselControls");
  const saveBtn = document.getElementById("saveBtn");

  let isBoxOpen = false;
  let currentIndex = 0;
  let polaroidElements = [];

  const photos = [
    {
      src: "assets/1.jpeg",
      title: "Feliz Cumpleaños, Mi Amor",
      text: "Cada día a tu lado es un regalo. Que este nuevo año de vida esté lleno de luz.",
    },
    {
      src: "assets/2.jpeg",
      title: "Eres mi inspiración",
      text: "Las flores palidecen ante tu belleza. Gracias por existir.",
    },
    {
      src: "assets/3.jpeg",
      title: "Por Nosotros",
      text: "Rezo por ti, por nuestro amor y por los momentos mágicos que nos quedan por vivir.",
    },
    {
      src: "assets/4.jpeg",
      title: "Mi lugar favorito",
      text: "En cada rincón del mundo, mi lugar favorito siempre será contigo.",
    },
    {
      src: "assets/5.jpeg",
      title: "Te Amo",
      text: "Mi amor por ti no cabe en palabras, pero espero que lo sientas en cada latido.",
    },
  ];

  // Interacción Magnética de la Caja (Parallax suave)
  document.addEventListener("mousemove", (e) => {
    if (isBoxOpen) return; // Detener efecto profundo si la caja está abierta

    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

    // Mantener la inclinación base y añadir el movimiento del cursor
    scene.style.transform = `rotateX(${-15 + yAxis}deg) rotateY(${25 + xAxis}deg)`;
  });

  document.addEventListener("mouseleave", () => {
    if (!isBoxOpen) {
      scene.style.transform = `rotateX(-15deg) rotateY(25deg)`;
    }
  });

  // Abrir la caja y mostrar el carrusel
  puzzleBox.addEventListener("click", () => {
    if (isBoxOpen) return;
    isBoxOpen = true;

    puzzleBox.classList.add("open");

    // Retraso para generar las fotos mientras se abre la tapa
    setTimeout(() => {
      createPolaroids();
      // Mostrar controles
      carouselControls.classList.add("visible");
    }, 600);
  });

  function createPolaroids() {
    photos.forEach((photoData, index) => {
      const el = document.createElement("div");
      el.className = "polaroid";

      // Nueva estructura directa sin flip
      el.innerHTML = `
        <div class="polaroid-image-container">
            <img src="${photoData.src}" alt="Memory">
        </div>
        <div class="polaroid-text-container">
            <h3>${photoData.title}</h3>
            <p>${photoData.text}</p>
        </div>
      `;

      // Prevenir bug visual de la última carta apareciendo encima brevemente
      el.style.zIndex = index === 0 ? 100 : 50 - index;
      // Iniciar desde el centro para que florezcan hacia arriba suavemente
      el.style.transform = `translate3d(0, 0, 0) scale(0.5)`;

      polaroidContainer.appendChild(el);
      polaroidElements.push(el);

      // Clicar en una foto lateral la convierte en activa
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentIndex !== index) {
          currentIndex = index;
          updateCarousel();
        }
      });
    });

    // Iniciar el render del layout distribuido
    setTimeout(() => {
      updateCarousel();
    }, 100);
  }

  function updateCarousel() {
    const isMobile = window.innerWidth <= 600;

    polaroidElements.forEach((el, index) => {
      const diff = index - currentIndex;
      const absDiff = Math.abs(diff);
      const direction = Math.sign(diff);

      let xOffset = 0;
      let yOffset = isMobile ? -100 : -220; // Más arriba para despejar la caja
      let zOffset = isMobile ? 0 : 200;
      let rotateY = -25;
      let rotateX = 15;
      let rotateZ = (Math.random() - 0.5) * 4;
      let scale = isMobile ? 0.85 : 1.1; // La carta central pequeña
      let opacity = 1;
      let filter = "none";
      let zIndex = 100;

      if (diff === 0) {
        zIndex = 100;
      } else {
        zIndex = 50 - absDiff;

        // SÚPER PEGADAS EN CELULAR
        const baseSpacing = isMobile ? 40 : 180;
        xOffset = direction * (baseSpacing + absDiff * (isMobile ? 10 : 15));

        yOffset = (isMobile ? -90 : -170) + absDiff * 10;
        zOffset = (isMobile ? -30 : 50) - absDiff * 60;

        rotateY = -25 + direction * (isMobile ? 8 : 15) * absDiff;
        rotateZ = direction * 5 * absDiff;

        // Las cartas de atrás enanas
        scale = (isMobile ? 0.65 : 0.85) - absDiff * 0.1;
        filter = `brightness(${1 - absDiff * 0.25})`;
      }

      // Aplicar al DOM
      el.style.zIndex = zIndex;
      el.style.transform = `translate3d(${xOffset}px, ${yOffset}px, ${zOffset}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
      el.style.filter = filter;
    });

    prevBtn.style.opacity = currentIndex === 0 ? "0.3" : "1";
    nextBtn.style.opacity = currentIndex === polaroidElements.length - 1 ? "0.3" : "1";

    if (currentIndex === polaroidElements.length - 1) {
      saveBtn.classList.add("visible");
    } else {
      saveBtn.classList.remove("visible");
    }
  }

  // Interacción Botones Flecha
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex < polaroidElements.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Guardar todas (Cerrar caja y resetear)
  saveBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Iniciar cierre de caja y ocultar controles
    puzzleBox.classList.remove("open");
    carouselControls.classList.remove("visible");
    saveBtn.classList.remove("visible");

    // Esperar a que la caja se cierre y las polaroids se desvanezcan
    setTimeout(() => {
      polaroidContainer.innerHTML = "";
      polaroidElements = [];
      currentIndex = 0;
      isBoxOpen = false;
    }, 1200);
  });
});
