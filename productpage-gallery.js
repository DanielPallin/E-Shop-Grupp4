const mainImage = document.getElementById("mainProductImage");
const thumbnails = document.querySelectorAll(".thumbnailRow img");

thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener("click", () => {


    mainImage.src = thumbnail.src;


    thumbnails.forEach(img => img.classList.remove("active"));


    thumbnail.classList.add("active");
  });
});