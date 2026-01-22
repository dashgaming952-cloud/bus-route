document.getElementById("searchBtn").addEventListener("click", () => {
  const route = document.getElementById("routeNumber").value.trim();
  const stop = document.getElementById("stopName").value.trim();

  if (!route && !stop) {
    alert("Enter Route Number or Stop Name");
    return;
  }

  let query = "";

  if (route) query = `?route=${route}`;
  else query = `?stop=${encodeURIComponent(stop)}`;

  window.location.href = "output.html" + query;
});
