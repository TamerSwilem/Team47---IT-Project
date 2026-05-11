import {articleObject, openArticle} from './general.js';

/*==============================
        RESULT ARTICLES
================================*/

// FILTER MENU TOGGLE
window.toggleFilterMenu = function(){
            const filters = document.querySelector('.filters');
            const checkbox = document.getElementById('filterCheckbox');
            filters.style.display = checkbox.checked ? 'none' : 'flex';
            document.querySelector('.featured').style.marginLeft = checkbox.checked ? '0' : '200px';}


const resultContainer = document.querySelector('.resultList');


function applyFilters(){

    let filteredArticles = articleObject.articles;

    // FILTER ARTICLES BY SEARCH INPUT
    const searchString = (new URLSearchParams(window.location.search).get('query') || '').toLowerCase();
    filteredArticles = filteredArticles.filter(article => {
        if (article.title.toLowerCase().includes(searchString)) return true;
        if (article.description.toLowerCase().includes(searchString)) return true;
        return false;
    })

    /*============================
    ======FILTER THE ARTICLES=====
    ==============================*/

    // SCOPE FILTER
    let checkGlobal = document.getElementById('scopeGlobal').checked;
    let checkLocal = document.getElementById('scopeLocal').checked;

    if(checkGlobal || checkLocal){
        filteredArticles = filteredArticles.filter(article => {
            if (checkGlobal && article.scope == 'global') return true;
            if (checkLocal && article.scope == 'local') return true;
            return false;
        })
    }

    // SPORT FILTER
    let checkFootball = document.getElementById('sportFootball').checked;
    let checkBoxing = document.getElementById('sportBoxing').checked;
    let checkDarts = document.getElementById('sportDarts').checked;

    if(checkFootball || checkBoxing || checkDarts){
        filteredArticles = filteredArticles.filter(article => {
            if (checkFootball && article.sport == 'football') return true;
            if (checkBoxing && article.sport == 'boxing') return true;
            if (checkDarts && article.sport == 'darts') return true;
            return false;
        })
    }

    // POPULARITY FILTER
    let checkNewest = document.getElementById('sortNewest').checked;
    let checkOldest = document.getElementById('sortOldest').checked;
    let checkPopular = document.getElementById('sortPopular').checked;

    if(checkNewest || checkOldest || checkPopular){
        filteredArticles = filteredArticles.sort((a,b) => {
            if (checkNewest) return b.id - a.id;
            if (checkOldest) return a.id - b.id;
            if (checkPopular) return b.popularity - a.popularity;
            return false;
        })
    }



    // PRINT THE FILTERED ARTICLES.
    resultContainer.innerHTML = filteredArticles.map(article => `

        <div class="resultItem featuredContainer" data-id="${article.id}">
            <div class="featuredImageContainer">
                <img src="${article.img || article.image}">
            </div>
            <div class="resultBody featuredData">
                <h3 class="featuredTitle">${article.title}</h3>
                <p>${article.description}</p>
            </div>
        </div>`).join('');


    // OPEN CLICKED ARTICLE.
    document.querySelectorAll('.resultItem').forEach(item =>{
        item.addEventListener('click', () => {
            openArticle(item.dataset.id);
        })
    })

}

document.querySelectorAll('.filterInput').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

if(resultContainer){
    applyFilters();  // run once on load to show all articles initially
}
