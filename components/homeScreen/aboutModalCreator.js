export default function createAboutModal() {
  const modal = document.querySelector("[data-about-modal]");

  function toggleModal() {
    if (!modal.classList.contains("is-active")) {
      modal.classList.toggle("is-active");
      setTimeout(() => modal.style.opacity = "1", 0);
    } else {
      modal.style.opacity = "0";
      setTimeout(() => modal.classList.toggle("is-active"), 250);
    }
  }

  modal.addEventListener("click", (event) => {
    let classList = event.target.classList;

    if (
      classList.contains("delete") ||
      classList.contains("modal-background")
    ) {
      toggleModal();
    } else if (event.target.tagName === "A") {
      event.preventDefault();
      preload.openLinkInOSBrowser(event.target.href);
    }
  });

  return { toggleModal };
}
