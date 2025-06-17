const videoGrid = document.getElementById("videoGrid");
const titleEl = document.getElementById("pageTitle");

// Get ?map=mirage&type=smokes&side=t from URL
const params = new URLSearchParams(window.location.search);
const map = params.get("map");
const type = params.get("type");
const side = params.get("side");

if (!map || !type || !side) {
  titleEl.textContent = "Missing map/type/side in URL";
} else {
  titleEl.textContent = `${map.toUpperCase()} – ${side.toUpperCase()} ${type}`;

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const basePath = isLocal ? "" : "/monkekingdom";
  const metadataPath = `${basePath}/videos/${map}/${type}/${side}/metadata.json`;

  fetch(metadataPath)
    .then((res) => res.json())
    .then((videos) => {
      videos.forEach((v) => {
        const card = document.createElement("div");
        card.className = "video-card";

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${v.id}`;
        iframe.setAttribute("frameborder", "0");
        iframe.allowFullscreen = true;
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.width = "100%";
        iframe.height = "200";

        const title = document.createElement("p");
        title.textContent = v.title;

        card.appendChild(iframe);
        card.appendChild(title);
        videoGrid.appendChild(card);
      });
    })
    .catch((err) => {
      videoGrid.innerHTML = `<p style="color:red;">Failed to load videos: ${err}</p>`;
    });
}
