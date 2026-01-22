const params = new URLSearchParams(window.location.search);
const route = params.get("route");
const stop = params.get("stop");

const output = document.getElementById("output");

async function loadResults() {
  try {
    const res = await fetch("bus_routes.json");
    const buses = await res.json();

    const results = buses.filter(bus =>
      (route && bus.routeNumber.toString() === route) ||
      (stop && bus.stops.some(s => s.toLowerCase().includes(stop.toLowerCase())))
    );

    if (results.length === 0) {
      output.innerHTML = "<p>No buses found</p>";
      return;
    }

    results.forEach(bus => {
      output.innerHTML += `
        <div class="result-card">
          <h3>Route ${bus.routeNumber}</h3>
          <p><b>Bus:</b> ${bus.busNumber}</p>
          <p><b>Start:</b> ${bus.startTime}</p>
          <p><b>Driver:</b> ${bus.driverName}</p>
          <p><b>Phone:</b> ${bus.driverPhone}</p>
          <p><b>Alcohol:</b> ${bus.alcoholLevel} BAC</p>
          <p><b>Tire:</b> ${bus.tirePressurePSI} PSI</p>
          <p>${bus.stops.map(s => `• ${s}`).join("<br>")}</p>
        </div>
      `;
    });

  } catch (err) {
    output.innerHTML = "<p>Error loading data</p>";
  }
}

loadResults();
