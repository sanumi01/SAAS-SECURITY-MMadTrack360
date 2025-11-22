document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (!root) return console.error("❌ #root not found");

  try {
    const reactRoot = Fy.createRoot(root);
    reactRoot.render(d.jsx(h("dashboard"), {}));
  } catch (e) {
    console.error("❌ React mount failed:", e);
    root.innerHTML = "<h1 style='color:white;text-align:center;padding-top:50px;'>⚠️ Dashboard mount failed</h1>";
  }
});
