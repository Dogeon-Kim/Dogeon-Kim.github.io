document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post");

  if (postId) {
    // 포스트 로딩
    fetch(`log/log${postId}/postlog${postId}.html`)
      .then(res => res.text())
      .then(html => {
        document.getElementById("postContainer").innerHTML = html;
      });

    // 댓글 로딩
    const savedComments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
    savedComments.forEach(comment => addCommentElement(comment.name, comment.text));

    // 추천 포스트 로딩
    loadRecommendations(Number(postId));
  }

  // 댓글 작성 처리
  document.getElementById("commentForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("commentName").value.trim();
    const text = document.getElementById("commentInput").value.trim();
    if (name === "" || text === "") return;

    const savedComments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
    savedComments.push({ name, text });
    localStorage.setItem(`comments_${postId}`, JSON.stringify(savedComments));
    addCommentElement(name, text);

    document.getElementById("commentName").value = "";
    document.getElementById("commentInput").value = "";
  });
});

function addCommentElement(name, text) {
  const commentList = document.getElementById("commentList");
  const item = document.createElement("div");
  item.className = "comment-item";
  item.innerHTML = `
    <span class="name" style="color: darkorange;">${name}</span>
    <span class="text">${text}</span>
    <button class="delete-btn" title="댓글 삭제">🗑️</button>
  `;
  item.querySelector(".delete-btn").addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    let savedComments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];
    savedComments = savedComments.filter(c => !(c.name === name && c.text === text));
    localStorage.setItem(`comments_${postId}`, JSON.stringify(savedComments));
    item.remove();
  });
  commentList.appendChild(item);
}

function loadRecommendations(currentId) {
  const recommendList = document.getElementById("recommendList");
  const totalPosts = 20;
  const candidates = [];

  for (let i = 1; i <= totalPosts; i++) {
    if (i !== currentId) candidates.push(i);
  }

  const shuffled = candidates.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, totalPosts); // 넉넉히 선택

  let count = 0;

  function tryNext(index) {
    if (count >= 3 || index >= selected.length) return;

    const i = selected[index];
    fetch(`post/post${i}.html`)
      .then(res => {
        if (!res.ok) throw new Error("skip");
        return res.text();
      })
      .then(html => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        const post = wrapper.querySelector(".post");
        if (post) {
          const title = post.querySelector("h2")?.textContent || "제목 없음";
          const img = post.querySelector("img")?.src || "";

          const item = document.createElement("div");
          item.className = "recommend-item";
          item.innerHTML = `
            <img src="${img}" />
            <h4>${title}</h4>
          `;
          item.addEventListener("click", () => {
            window.location.href = `main.html?post=${i}`;
          });

          recommendList.appendChild(item);
          count++;
        }
        tryNext(index + 1);
      })
      .catch(() => {
        tryNext(index + 1);
      });
  }

  tryNext(0);
}

