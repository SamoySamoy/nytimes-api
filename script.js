// Defining a baseURL and key to as part of the request URL
const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = 'fFtQQS5qQ0Vzx2gyCE9EryIzi6exRNqK'; // API key 

// Grab references to all the DOM elements you'll need to manipulate
const searchTerm = document.querySelector('.search'); 
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const section = document.querySelector('section');
const nav = document.querySelector('nav');
const saveButton = document.querySelector('.save');
const greeting = document.querySelector('.name-greeting');
const para = document.querySelector('#greet');
const nameInput = document.querySelector('#name');

// Hide the "Previous"/"Next" navigation to begin with, as we don't need it immediately
nav.style.display = 'none';

// define the initial page number and status of the navigation being displayed
let pageNumber = 0;


// Event listeners to control the functionality
searchForm.addEventListener('submit', e => {
  pageNumber = 0;
  fetchResults(e);
});
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);
saveButton.addEventListener('click', () => {
  para.textContent = `Welcome back, ${nameInput.value}`
  greeting.appendChild(para);
})


function fetchResults(e) {
  e.preventDefault(); // explain: why we need preventDefault in this case?
  // because the default action when submitting a form is sending request and (maybe)
  // refresh the data, so we usually call preventDefault() to do smt with the data before
  // it is sent -> mandatory action


  // Assemble the full URL
  let url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}&fq=document_type:("article")`;
  if (startDate.value !== '') {
    url += `&begin_date=${startDate.value}`;
  };

  if (endDate.value !== '') {
    url += `&end_date=${endDate.value}`;
  };

  // Use fetch() to make the request to the API
  fetch(url)
    .then(response => response.json())
    .then(json => displayResults(json))
    .catch(error => console.error(`Error fetching data: ${error.message}`));
    
}

function displayResults(json) {
  // delete all content of section area
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  const articles = json.response.docs;

  if (articles.length === 10) {
    nav.style.display = 'block';
  } 
  else {
    nav.style.display = 'none';
  }

  if (articles.length === 0) {
    const para = document.createElement('p');
    para.textContent = 'No results returned.'
    section.appendChild(para);
  } 
  else {
    for (const current of articles) {
      const article = document.createElement('article');
      const heading = document.createElement('h2');
      const link = document.createElement('a');
      const img = document.createElement('img');
      const para1 = document.createElement('p');
      const keywordPara = document.createElement('p');
      keywordPara.classList.add('keywords');

      console.log(current);

      link.href = current.web_url;
      link.textContent = current.headline.main;
      para1.textContent = current.snippet;
      keywordPara.textContent = 'Keywords: ';
      for (const keyword of current.keywords) {
        const span = document.createElement('span');
        span.textContent = `${keyword.value} `;
        keywordPara.appendChild(span);
      }

      if (current.multimedia.length > 0) {
        img.src = `http://www.nytimes.com/${current.multimedia[0].url}`;
        img.alt = current.headline.main;
      }

      article.appendChild(heading);
      heading.appendChild(link);
      article.appendChild(img);
      article.appendChild(para1);
      article.appendChild(keywordPara);
      section.appendChild(article);
    }
  }
};

function nextPage(e) {
  pageNumber++;
  fetchResults(e);
};

function previousPage(e) {
  if (pageNumber > 0) {
    pageNumber--;
  }
  else {
    return;
  }
  fetchResults(e);
};