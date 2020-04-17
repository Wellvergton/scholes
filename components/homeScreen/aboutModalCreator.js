export default function createAboutModal() {
  const modal = document.querySelector("[data-about-modal]");

  function toggleModal() {
    modal.classList.toggle("is-active");
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
      openLinkInOSBrowser(event.target.href);
    }
  });

  return { toggleModal };
}
