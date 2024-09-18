function eraser(selector) {
    let works = document.querySelector(selector);
    works.innerHTML = '';
}


async function getWorks() {
    const answer = await fetch("http://localhost:5678/api/works");
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


function createbutton(project) {
   let name =  project.filter((item,index) => project.indexOf(item) === index);
    let filters = document.getElementById('portfolio');
    const portfolio = document.createElement('div');
    portfolio.classList.add ('filters');
    for (let i = 0; i < name.length; i++) {
        const btn = document.createElement('button');
        btn.textContent = name[i].category.name;
        filters.appendChild(portfolio);
        portfolio.appendChild(btn);
    }
}
async function main() {
    const projects = await getWorks();
    eraser('.gallery');
    filtersname(projects);
    createbutton(projects);
    displayWorks(projects);
}
main();