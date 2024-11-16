function updateHeaderSize() {
    const parent = document.getElementById("parent");
    const header = document.getElementById("header");

    // Получаем координаты и размеры родителя
    const parentRect = parent.getBoundingClientRect();

    // Задаем фиксированному элементу ширину и позицию родителя
    header.style.width = parentRect.width - 10 + "px";
    header.style.left = parentRect.left + "px";
}

// Обновляем размеры при загрузке страницы и при изменении размеров окна
window.addEventListener("resize", updateHeaderSize);
window.addEventListener("load", updateHeaderSize);