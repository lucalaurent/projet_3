    let works = document.querySelector('.gallery');
works.innerHTML = '';

async function getWorks() {
    const projects = await fetch("https://localhost:5678/api/works");
}
async function displayWorks() {
    const projects = await getWorks();
    console.log("avec index");
    for (let i = 0; i < projects.length; i++) {
        console.log(projects[i]);
    }
}

let display = document.querySelector('.gallery');
let newWorks = displayWorks();
display.innerHTML = newWorks;