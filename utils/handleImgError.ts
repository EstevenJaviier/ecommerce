export const handleImgError = (e: Event) => {
  const el = e.target as HTMLImageElement;
  el.onerror = null; // evita loop si la imagen fallback falla también
  el.src = "/plaholder.png";
};
