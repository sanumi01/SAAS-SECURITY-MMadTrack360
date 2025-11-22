const Sidebar = () => {
  return React.createElement("div", {
    style: {
      width: "200px",
      backgroundColor: "#222",
      color: "white",
      height: "100vh",
      padding: "20px",
      boxSizing: "border-box",
      position: "fixed",
      top: 0,
      left: 0
    }
  }, [
    React.createElement("h2", { key: "title" }, "MMadTrack360"),
    React.createElement("ul", { key: "nav", style: { listStyle: "none", padding: 0 } }, [
      "Dashboard", "Billing", "Tracking", "Staff", "Settings"
    ].map((item, i) =>
      React.createElement("li", {
        key: i,
        style: { margin: "10px 0", cursor: "pointer" },
        onClick: () => alert(item + " clicked")
      }, item)
    ))
  ]);
};

const MainContent = () => {
  return React.createElement("div", {
    style: {
      marginLeft: "220px",
      padding: "40px",
      color: "white"
    }
  }, [
    React.createElement("h1", { key: "header" }, "📊 MMadTrack360 Admin Dashboard"),
    React.createElement("p", { key: "welcome" }, "Welcome back, Kolade."),
    React.createElement("select", {
      key: "dropdown",
      onChange: (e) => alert("Selected: " + e.target.value),
      style: { marginTop: "20px", padding: "10px", fontSize: "16px" }
    }, [
      React.createElement("option", { key: "default" }, "Choose a view"),
      React.createElement("option", { key: "staff" }, "Staff Dashboard"),
      React.createElement("option", { key: "billing" }, "Billing"),
      React.createElement("option", { key: "tracking" }, "Live Tracking")
    ])
  ]);
};

const App = () => {
  return React.createElement(React.Fragment, null, [
    React.createElement(Sidebar, { key: "sidebar" }),
    React.createElement(MainContent, { key: "main" })
  ]);
};

const root = document.getElementById("root");
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(React.createElement(App));
