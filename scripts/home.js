import { articleObject, openArticle } from './general.js';

/*==============================
        HOMEPAGE - CARD
================================*/

let mostPopularArticle = articleObject.articles[0];
for (let i = 1; i < articleObject.articles.length; i++){
    if (articleObject.articles[i].popularity > mostPopularArticle.popularity){
        mostPopularArticle = articleObject.articles[i];
    }
}

let featuredCardContainer = document.querySelector('.cardFeatured');
if(featuredCardContainer){
    featuredCardContainer.innerHTML = `
            <div class="heroArticleImageContainer">
                <img class="cardThumbnail" src="${mostPopularArticle.img || mostPopularArticle.image}">
            </div>
            <div class="heroArticleData">
                <h1 class="heroArticleHeader cardTitle">
                    ${mostPopularArticle.title}
                </h1>
                <p class="cardDescription">
                    ${mostPopularArticle.description}
                </p>
            </div>
`;

    featuredCardContainer.addEventListener('click', ()=>{
        openArticle(mostPopularArticle.id);
    })
}

/*==============================
    HOMEPAGE - SIDE ARTICLES
================================*/

let sideArticles = articleObject.articles.filter(article => article.id !== mostPopularArticle.id);
let sideArticlesContainer = document.querySelector('.resultList');
if(sideArticlesContainer){
    sideArticlesContainer.innerHTML = sideArticles.map(article => `

    <div class="resultItem featuredContainer" data-id="${article.id}">
        <div class="featuredImageContainer">
            <img src="${article.img || article.image}">
        </div>
        <div class="resultBody featuredData">
            <h3 class="featuredTitle">${article.title}</h3>
            <p>${article.description}</p>
        </div>
    </div>`

).join('');

    document.querySelectorAll('.resultItem').forEach(item => {
        item.addEventListener('click', () => {
            openArticle(item.dataset.id);
        })

    });
}
