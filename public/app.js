// Encodes input as text
function encodeInput(input) {
  return $("<div>").text(input).html();
}

// Saves toggle button state
function saveToggle() {
  var checked = document.getElementById("toggle-btn");
  localStorage.setItem("toggle-btn", checked.checked);
}

// Loads toggle button state
function loadToggle() {
  var checked = JSON.parse(localStorage.getItem("toggle-btn"));
  document.getElementById("toggle-btn").checked = checked;
  if (checked == true) {
    isToggled = true;
    document.getElementById("output").innerHTML =
      "Switched On: Input is encoded";
  } else {
    isToggled = false;
    document.getElementById("output").innerHTML = "Switched Off: Vulnerable";
  }
}

// Deletes all of the posts in the database
function deletePosts() {
  fetch("/api", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  }).then(function (response) {
    return response.json;
  });
}

// Displays a single post
// Search results are displayed under the search form
function displayPost(item, isSearch) {
  const root = document.createElement("div");
  root.classList.add("single-post");

  const title = document.createElement("h3");
  title.innerHTML = `${item.title}`;

  const body = document.createElement("p");
  body.innerHTML = `${item.body}`;

  root.append(title, body);

  if (isSearch) {
    $(".search-results").append(root);
  } else $(".posts").append(root);
}

// Displays all posts
function displayPosts(data, isSearch) {
  for (item of data) {
    displayPost(item, isSearch);
  }
}

// Fetches all posts
getAllPosts();
async function getAllPosts() {
  const response = await fetch("/api");
  if (response.status === 200) {
    const data = await response.json();
    displayPosts(data);
  }
}

// Fetches a newly created post
async function getPost() {
  const response = await fetch("/api");
  if (response.status === 200) {
    const data = await response.json();
    displayPost(data[data.length - 1]);
  }
}

// Toggles the switch to encode new input
// When the switch is off, the input is not encoded
var isToggled;
function toggle() {
  saveToggle();
  if (!isToggled) {
    isToggled = true;
    document.getElementById("output").innerHTML =
      "Switched On: Input is encoded";
  } else {
    isToggled = false;
    document.getElementById("output").innerHTML = "Switched Off: Vulnerable";
  }
}

// Grabs the input from the title and body forms and posts it
// Fetches the newly created post
const formPost = document.getElementById("form-post");
formPost.addEventListener("submit", function (event) {
  event.preventDefault();
  var title = document.getElementById("title").value;
  var body = document.getElementById("body").value;
  var data;

  // if switch is on, encode input
  if (isToggled) {
    title = encodeInput(title);
    body = encodeInput(body);
  }
  data = { title, body };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch("/api", options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("You posted: ", data);
    });

  getPost();
});

// Fetches and displays the search results
function getSearchResults(search) {
  const url = "/search?title=" + search + "&body=" + search;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(".search-results").empty();
      document.getElementById("search-results-label").style.visibility =
        "visible";

      // if switch is on, encode input
      if (isToggled) {
        document.getElementById("search-results-label").innerHTML =
          data.length + " result(s) for " + encodeInput(search);
      } else {
        document.getElementById("search-results-label").innerHTML =
          data.length + " result(s) for " + search;
      }

      displayPosts(data, true);
    });
}

// Returns the query string from the location bar
function getQueryString() {
  var qs = document.location.search;
  qs = qs.split("=");
  qs = decodeURIComponent(qs[1]);

  // if switch is on, encode input
  if (isToggled) {
    qs = encodeInput(qs);
  }

  return qs;
}

// Fills the search form with the query string from the location bar and gets the search results
$(document).ready(function () {
  loadToggle();
  var search = getQueryString();
  if (search != "undefined") {
    document.getElementById("search").value = search;
    getSearchResults(search);
  }
});

// Grabs the input from the search form and gets the search results
const formSearch = document.getElementById("form-search");
formSearch.addEventListener("submit", function (event) {
  event.preventDefault();
  search = document.getElementById("search").value;
  getSearchResults(search);
});
