const form = document.getElementById("try-form") as HTMLFormElement;
const input = document.getElementById("ens-input") as HTMLInputElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = input.value.trim();
  if (!name) return;
  if (!name.endsWith(".eth")) name += ".eth";
  window.location.href = `/${name}`;
});
