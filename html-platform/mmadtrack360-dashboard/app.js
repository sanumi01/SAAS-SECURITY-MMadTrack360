// Staff data storage
let staffData = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@company.com",
        phone: "+44 7700 900123",
        role: "Senior Guard",
        department: "Security",
        status: "On Duty"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        phone: "+44 7700 900124",
        role: "Security Guard",
        department: "Surveillance",
        status: "Off Duty"
    }
];

// Navigation function
function navigateTo(pageName) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const targetPage = document.getElementById("page-" + pageName);
    if (targetPage) {
        targetPage.classList.remove("hidden");
    }

    if (pageName === "staff-list") {
        renderStaffTable();
    }
}

// Add all your other JavaScript functions here
