function eraser(selector) {
    let works = document.querySelector(selector);
    works.innerHTML = '';
}
async function getWorks() {
    const answer = await fetch("http://localhost:5678/api/works");
    return await answer.json();
}
async function getCategories() {
    const answer = await fetch("http://localhost:5678/api/categories");
    return await answer.json();
}
async function displayWorks(projects) {
    // Check if projects is undefined or not an array
    if (!projects || !Array.isArray(projects)) {
        console.error("No projects data or the response is not an array");
        return; // Stop the function if projects is invalid
    }
    let display = document.querySelector('.gallery');

    console.log(projects);
    for (let i = 0; i < projects.length; i++) {
        //  console.log(projects[i]);

        displayWorkInGallery(projects[i], display);
    }
}
async function displayWorkInGallery(project, root) {
    //console.log(project);
    const container = document.createElement('figure');
    const work = document.createElement('figcaption');
    const img = document.createElement('img');
    work.textContent = project.title;
    img.src = project.imageUrl;
    img.alt = project.title;
    root.appendChild(container);
    container.appendChild(img);
    container.appendChild(work);
}
function createbutton(categories) {
    let portfolio = document.getElementById('portfolio');
    const filters = document.createElement('div');
    filters.classList.add('filters');
    portfolio.appendChild(filters);
    buttoncreation(filters, 'Tous', 0);
    for (let i = 0; i < categories.length; i++) {
        buttoncreation(filters, categories[i].name, categories[i].id);
    }
}
function buttoncreation(filters, name, catId) {
    if (localStorage.getItem('token') === null) {
        const btn = document.createElement('button');
        btn.textContent = name;
        filters.appendChild(btn);
        btn.addEventListener('click', () => filterWorks(catId));
    }
    else {
        const btn = document.getElementById('modal-opener');
        btn.style.display = 'flex';
    }
}

async function filterWorks(buttonId) {
    const works = await getWorks();
    eraser('.gallery');
    if (buttonId === 0) {
        displayWorks(works);
    }
    else {
        let filteredWorks = works.filter(project => project.categoryId === buttonId);
        displayWorks(filteredWorks);
    }
}

let modal = null;

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'))
    console.log(e.target);
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
}

const closeModal = function (e) {
    console.log(modal);
    e.preventDefault();
    if (e.target === modal || e.target.classList.contains('close-modal')) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.close-modal').removeEventListener('click', closeModal);
        modal = null;
    }
}

function modalContent(project) {
    //mettre dans une boucle avec les properties. 
    console.log(project);
    for (let i = 0; i < project.length; i++) {
        const container = document.querySelector('.works-modifiable');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const trash = document.createElement('button');
        img.src = project[i].imageUrl;
        img.alt = project[i].title;
        trash.textContent = 'Supprimer';
        container.appendChild(figure);
        figure.appendChild(img);
        img.appendChild(trash);
    }
}
//Ajouter la corbeille,
// Ajouter event listener sur chacunne des corbeilles pour supprimer les Works
// Current target pour supprimer un work de la modal ET du front avec "Fetch Delete : ID" 
//Ajouter le bouton pour fermer la modal ET event listener pour fermer la modal 


async function main() {
    const projects = await getWorks();
    const categories = await getCategories();
    eraser('.gallery');
    createbutton(categories);
    displayWorks(projects);
    document.querySelector('.js-modal').addEventListener('click', openModal)
    modalContent(projects);
}
main();