function toggleInputs(type) {
  const route = document.getElementById("routeNumber");
  const stop = document.getElementById("stopName");

  if (type === "route" && route.value) {
    stop.value = ""; // auto-clear stop
  }

  if (type === "stop" && stop.value) {
    route.value = ""; // auto-clear route
  }
}

async function searchBus() {
  const routeNumber = document.getElementById("routeNumber").value.trim();
  const stopName = document.getElementById("stopName").value.trim().toLowerCase();
  const output = document.getElementById("output");
  const btn = document.getElementById("searchBtn");

  if (!routeNumber && !stopName) {
    output.innerHTML =
      "<p class='error'>Please enter Route Number or Stop Name</p>";
    return;
  }

  btn.innerText = "Searching...";
  output.innerHTML = "";

  try {
    const res = await fetch("bus_routes.json");
    const buses = await res.json();

    const results = buses.filter(bus =>
      (routeNumber && bus.routeNumber.toString() === routeNumber) ||
      (stopName && bus.stops.some(s => s.toLowerCase().includes(stopName)))
    );

    btn.innerText = "Search";

    if (results.length === 0) {
      output.innerHTML = "<p class='error'>No buses found</p>";
      return;
    }

    results.forEach(bus => {
      output.innerHTML += `
        <div class="result-card">
          <span class="badge">Route ${bus.routeNumber}</span>
          <p><strong>Bus:</strong> ${bus.busNumber}</p>
          <p>⏰ ${bus.startTime}</p>
          <p>👨‍✈️ <b>Driver:</b> ${bus.driverName}</p>
          <p>📞 <b>Phone:</b> ${bus.driverPhone}</p>
          <p> <b>Alcohol Level:</b> ${bus.alcoholLevel}</p>
          <p>🛞 <b>Tire Pressure:</b> ${bus.tirePressurePSI} PSI</p>
          <p class="stops">
            ${bus.stops.map(s => `• ${s}`).join("<br>")}
          </p>
        </div>
      `;
    });

  } catch (err) {
    btn.innerText = "Search";
    output.innerHTML =
      "<p class='error'>Failed to load bus data</p>";
    console.error(err);
  }
}

/* ✅ Trigger search ONLY when Enter is pressed in inputs */
["routeNumber", "stopName"].forEach(id => {
  document.getElementById(id).addEventListener("keydown", e => {
    if (e.key === "Enter") {
      searchBus();
    }
  });
});
