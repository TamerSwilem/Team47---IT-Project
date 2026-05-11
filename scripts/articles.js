import { articleObject } from './general.js';

/*==============================
        RENDER ARTICLES SECTION
================================*/

let params = new URLSearchParams(window.location.search);
let id = params.get('id'); // ID is a string. we can use == or number(id); to solve this issue.
let article = articleObject.articles.find(article => article.id == id);

let articleContainer = document.querySelector('.article');

fetch(article.contentFile)
    .then(response => response.text())
    .then(text => {
        articleContainer.innerHTML = `
        <div class="articleFlex">
            <h1 class="articleTitle">${article.articleTitle}</h1>
            <p class="articleDescription">${article.description}</p>
            <p class="articleDate">${article.date}</p>
            <img class="articleImage" src="${article.image}" alt="">
            <pre class="articleContent">${text}</pre>
        </div>
        <section class="articleRecommendations">
            <div class="featuredFlex"></div>
        </section>
    `;

        let sideArticles = articleObject.articles.filter(item => item.id !== article.id);
        let sideArticlesContainer = document.querySelector('.featuredFlex');
        sideArticlesContainer.innerHTML = sideArticles.map(item => `

            <div class="featuredContainer" data-id="${item.id}">
                <div class="featuredImageContainer">
                    <img src="${item.image}" alt="">
                </div>
                <div class="featuredData">
                    <h2 class="featuredTitle">${item.title}</h2>
                </div>
            </div>`

        ).join('');

        document.querySelectorAll('.featuredContainer').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = `article.html?id=${item.dataset.id}`;
            })
        });
    });
