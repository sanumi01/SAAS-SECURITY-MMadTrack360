document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (!root) return console.error("❌ #root not found");

  root.innerHTML = "<h1 style='color:white;text-align:center;padding-top:50px;'>✅ Final JS Executed</h1>";
});
