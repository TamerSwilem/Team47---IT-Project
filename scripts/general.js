/*==============================
        DARK MODE SECTION
================================*/
window.toggleDarkMode = function(){
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

if(localStorage.getItem('darkMode') === 'true'){
    document.body.classList.add('dark');
}

/*==============================
        LOAD ARTICLES SECTION
================================*/

export let response = await fetch('data/articles.json');
export let articleObject = await response.json();
window.articleObject = articleObject;
console.log(articleObject.articles);

/*==============================
        OPEN ARTICLES SECTION
================================*/

export function openArticle(id){
    window.location.href = `article.html?id=${id}`;
}

window.openArticle = openArticle;

/*==============================
        SEARCH BAR SECTION
================================*/
const searchBar = document.querySelector('.navSearch, .navBarSearch');
if(searchBar){
    searchBar.addEventListener('keydown', event =>{
        if(event.key == 'Enter'){
            window.location.href = `searchresult.html?query=${searchBar.value.toLowerCase()}`;
        }
    });
}
