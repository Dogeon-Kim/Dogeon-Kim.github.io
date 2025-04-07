const postsContainer = document.getElementById("posts-container");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const noResultMessage = document.getElementById("noResultMsg");
const suggestionBox = document.getElementById("suggestionBox");
const sortSelect = document.getElementById("sortSelect");
const previewBox = document.getElementById("preview");

const postsPerLoad = 3;
let currentIndex = 1;
let postLimit = 999;
let allPosts = [];

function loadSinglePost(index) {
  return fetch(`post/post${index}.html`)
    .then(res => {
      if (!res.ok) throw new Error("not found");
      return res.text();
    })
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const post = wrapper.querySelector(".post");
      if (post) {
        post.style.display = "none";
        post.setAttribute("data-id", index);

        post.addEventListener("click", () => {
          const id = post.getAttribute("data-id");
          if (id) {
            window.location.href = `main.html?post=${id}`;
          }
        });

        const previewText = post.querySelector("p")?.textContent || "";

        post.addEventListener("mousemove", e => {
          previewBox.style.left = e.pageX + 15 + "px";
          previewBox.style.top = e.pageY + 15 + "px";
          previewBox.textContent = previewText;
          previewBox.style.display = "block";
        });

        post.addEventListener("mouseleave", () => {
          previewBox.style.display = "none";
        });

        postsContainer.appendChild(post);
        allPosts.push(post);
        return true;
      }
      return false;
    })
    .catch(() => false);
}

async function loadNextPosts() {
  let loaded = 0;
  while (loaded < postsPerLoad && currentIndex <= postLimit) {
    const success = await loadSinglePost(currentIndex);
    currentIndex++;
    if (success) loaded++;
    else break;
  }
  showVisiblePosts();
  if (loaded < postsPerLoad) {
    loadMoreBtn.style.display = "none";
  }
}

function showVisiblePosts() {
  let shown = 0;
  for (let post of allPosts) {
    if (post.style.display === "none") {
      post.style.display = "flex";
      shown++;
      if (shown >= postsPerLoad) break;
    }
  }
}

function runSearch() {
  const query = searchInput.value.toLowerCase();
  let anyVisible = false;

  allPosts.forEach(post => {
    const title = post.querySelector("h2").textContent.toLowerCase();
    const content = post.querySelector("p").textContent.toLowerCase();

    if (title.includes(query) || content.includes(query)) {
      post.style.display = "flex";
      anyVisible = true;
    } else {
      post.style.display = "none";
    }
  });

  noResultMessage.style.display = anyVisible ? "none" : "block";
  suggestionBox.style.display = "none";

  if (anyVisible && currentIndex <= postLimit) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }
}

function updateSuggestions(query) {
  suggestionBox.innerHTML = "";
  suggestionBox.style.display = "none";

  if (!query) return;

  const matched = allPosts.filter(post => {
    const title = post.querySelector("h2").textContent.toLowerCase();
    const content = post.querySelector("p").textContent.toLowerCase();
    return title.includes(query) || content.includes(query);
  });

  if (matched.length > 0) {
    matched.forEach(post => {
      const title = post.querySelector("h2").textContent;
      const imgEl = post.querySelector(".post-image img");

      const suggestItem = document.createElement("div");
      suggestItem.classList.add("suggest-item");

      suggestItem.innerHTML = `
        <img src="${imgEl?.src || ''}" alt="thumbnail" />
        <span>${title}</span>
      `;

      suggestItem.addEventListener("click", () => {
        searchInput.value = title;
        runSearch();
      });

      suggestionBox.appendChild(suggestItem);
    });

    suggestionBox.style.display = "block";
  }
}

searchButton.addEventListener("click", runSearch);

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") runSearch();
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  clearBtn.style.display = query.length > 0 ? "inline-flex" : "none";
  updateSuggestions(query);
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";
  noResultMessage.style.display = "none";
  suggestionBox.style.display = "none";
  allPosts.forEach(post => post.style.display = "flex");
  if (currentIndex <= postLimit) {
    loadMoreBtn.style.display = "block";
  }
});

loadMoreBtn.addEventListener("click", loadNextPosts);

sortSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  sortAndRenderPosts(value);
});

function sortAndRenderPosts(order) {
  const posts = [...allPosts];
  postsContainer.innerHTML = "";

  if (order === "newest") {
    posts.reverse();
  }

  let visibleCount = 0;
  posts.forEach(post => {
    if (post.style.display !== "none") {
      post.classList.add("fade-in");
      postsContainer.appendChild(post);
      visibleCount++;
    }
  });

  noResultMessage.style.display = "none";
  suggestionBox.style.display = "none";

  if (visibleCount < allPosts.length) {
    loadMoreBtn.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadNextPosts();
});
