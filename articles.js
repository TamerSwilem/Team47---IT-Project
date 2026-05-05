const articlesFile = "data/articles.json";

async function loadArticles() {
  const response = await fetch(articlesFile);
  return response.json();
}

async function loadArticleText(file) {
  const response = await fetch(file);
  return response.text();
}

function createArticleCard(article) {
  return `
    <a href="article.html?id=${article.id}" class="article-link">
      <div class="featuredContainer">
        <div class="featuredImageContainer">
          <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="featuredData">
          <h2 class="featuredTitle">${article.title}</h2>
        </div>
      </div>
    </a>
  `;
}

async function renderFeaturedArticles() {
  const articles = await loadArticles();
  const grid = document.querySelector(".featuredGrid");
  if (!grid) return;
  grid.innerHTML = articles.map(createArticleCard).join("");
}

async function renderHeroArticle() {
  const articles = await loadArticles();
  if (!articles.length) return;

  const article = articles[0];
  const heroLink = document.querySelector(".heroArticleLink");
  if (!heroLink) return;

  heroLink.href = "article.html?id=" + article.id;
  const image = document.querySelector(".heroArticleImage");
  const title = document.querySelector(".heroArticleHeader");

  if (image) {
    image.src = article.image;
    image.alt = article.title;
  }
  if (title) {
    title.textContent = article.title;
  }
}

function parseDate(article) {
  const parts = (article.date || "1 / 1 / 2000").match(/\d+/g) || ["1", "1", "2000"];
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

function getSearchQuery() {
  return new URLSearchParams(window.location.search).get("q") || "";
}

function getFilterValues() {
  const params = new URLSearchParams(window.location.search);
  return {
    scopes: params.getAll("scope"),
    sports: params.getAll("sport"),
    sort: params.get("sort")
  };
}

function filterArticles(articles) {
  const searchText = getSearchQuery().toLowerCase();
  const filters = getFilterValues();

  return articles.filter((article) => {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();
    const textMatch = title.includes(searchText) || description.includes(searchText);
    const scopeMatch = !filters.scopes.length || filters.scopes.includes(article.scope);
    const sportMatch = !filters.sports.length || filters.sports.includes(article.sport);
    return textMatch && scopeMatch && sportMatch;
  });
}

function sortArticles(articles) {
  const sortType = getFilterValues().sort;

  if (sortType === "newest") {
    articles.sort((a, b) => parseDate(b) - parseDate(a));
  } else if (sortType === "oldest") {
    articles.sort((a, b) => parseDate(a) - parseDate(b));
  } else if (sortType === "popular") {
    articles.sort((a, b) => b.popularity - a.popularity);
  }

  return articles;
}

async function renderSearchResults() {
  const articles = await loadArticles();
  const results = sortArticles(filterArticles(articles));
  const grid = document.querySelector(".featuredGrid");
  if (!grid) return;
  grid.innerHTML = results.map(createArticleCard).join("");
}

async function renderArticlePage() {
  const articles = await loadArticles();
  if (!articles.length) return;

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("id") || articles[0].id;
  const article = articles.find((item) => item.id === articleId) || articles[0];
  const articleText = await loadArticleText(article.contentFile);

  const title = document.querySelector(".articleTitle");
  const description = document.querySelector(".articleDescription");
  const date = document.querySelector(".articleDate");
  const image = document.querySelector(".articleImage");
  const content = document.querySelector(".articleContent");
  const recommended = document.querySelector(".featuredFlex");

  if (title) title.textContent = article.articleTitle || article.title;
  if (description) description.textContent = article.description;
  if (date) date.textContent = article.date;
  if (image) {
    image.src = article.image;
    image.alt = article.title;
  }
  if (content) content.textContent = articleText;
  if (recommended) {
    recommended.innerHTML = articles
      .filter((item) => item.id !== article.id)
      .slice(0, 4)
      .map(createArticleCard)
      .join("");
  }
}

function initArticleSearch() {
  document.querySelectorAll(".navBarSearch").forEach((searchInput) => {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const query = encodeURIComponent(searchInput.value);
        window.location.href = "searchresult.html?q=" + query;
      }
    });
  });
}

function initArticleFilters() {
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('input[name="scope"]').forEach((checkbox) => {
    checkbox.checked = params.getAll("scope").includes(checkbox.value);
  });
  document.querySelectorAll('input[name="sport"]').forEach((checkbox) => {
    checkbox.checked = params.getAll("sport").includes(checkbox.value);
  });
  document.querySelectorAll('input[name="sort"]').forEach((radio) => {
    radio.checked = params.get("sort") === radio.value;
  });

  const filters = document.querySelector(".filters");
  if (!filters) return;

  filters.addEventListener("change", () => {
    const newParams = new URLSearchParams();
    document.querySelectorAll('input[name="scope"]:checked').forEach((checkbox) => {
      newParams.append("scope", checkbox.value);
    });
    document.querySelectorAll('input[name="sport"]:checked').forEach((checkbox) => {
      newParams.append("sport", checkbox.value);
    });
    const activeSort = document.querySelector('input[name="sort"]:checked');
    if (activeSort) {
      newParams.set("sort", activeSort.value);
    }
    const query = getSearchQuery();
    if (query) {
      newParams.set("q", query);
    }
    window.location.search = newParams.toString();
  });

  const toggle = document.querySelector(".filterToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      filters.classList.toggle("open");
    });
  }
}
