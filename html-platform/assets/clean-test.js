document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (!root) return console.error("❌ #root not found");

  try {
    const reactRoot = window.React.createRoot(root);
    reactRoot.render(window.jsx("div", {
      style: { color: "white", textAlign: "center", paddingTop: "50px" },
      children: [
        window.jsx("h1", { children: "✅ MMadTrack360 Dashboard React Mount" }),
        window.jsx("p", { children: "React is working. Original view was empty." }),
        window.jsx("button", {
          onClick: () => alert("Dropdown works ✅"),
          children: "Test Dropdown"
        })
      ]
    }));
  } catch (e) {
    console.error("❌ React mount failed:", e);
  }
});
