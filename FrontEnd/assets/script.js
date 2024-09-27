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
    const work = document.createElement('figure');
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
    buttoncreation(filters, 'Tous',0);
    for (let i = 0; i < categories.length; i++) {
      buttoncreation(filters, categories[i].name, categories[i].id);
    }
}
function buttoncreation(filters, name, catId) {
    const btn = document.createElement('button');
    btn.textContent = name;
    filters.appendChild(btn);
    btn.addEventListener('click',() => filterWorks(catId)  );
}

async function filterWorks(buttonId) {
    const works = await getWorks();
    eraser('.gallery');
    if (buttonId === 0 ) {
        displayWorks(works);
    }
    else {
        let filteredWorks = works.filter(project => project.categoryId === buttonId);
        displayWorks(filteredWorks);
    }
}
async function main() {
    const projects = await getWorks();
    const categories = await getCategories();
    eraser('.gallery');
    createbutton(categories);
    displayWorks(projects);
}
main();