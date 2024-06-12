const databaseSelector = document.getElementById("database-selector");

const setDatabaseCookie = (database) => {
  document.cookie =
    encodeURIComponent("database") + "=" + encodeURIComponent(database);
};

if (!document.cookie.includes("database")) {
  setDatabaseCookie("mongodb");
}

if (document.cookie.includes("mariadb")) {
  databaseSelector.checked = true;
}

databaseSelector.addEventListener("change", () => {
  if (document.cookie.includes("mariadb")) {
    setDatabaseCookie("mongodb");

    location.reload();

    return;
  }

  setDatabaseCookie("mariadb");

  location.reload();
});
