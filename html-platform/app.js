// Polished app.js for MMadTrack360
document.addEventListener("DOMContentLoaded", () => {
  console.log("MMadTrack360 frontend loaded");

  const forms = document.querySelectorAll("form");
  forms.forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputs = Array.from(form.querySelectorAll("input"));
      const data = {};
      inputs.forEach(input => data[input.name || input.placeholder] = input.value);

      const endpoint = form.dataset.endpoint;
      if (!endpoint) return alert("No endpoint defined");

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        alert(res.ok ? "Success" : "Failed");
        console.log(result);
      } catch (err) {
        console.error("Request failed:", err);
        alert("Error sending request");
      }
    });
  });
});
