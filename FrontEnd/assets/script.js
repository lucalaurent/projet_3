//Retire le contenu de selector
function eraser(selector) {
    let works = document.querySelector(selector);
    works.innerHTML = ''; 
}

//Récupère les "works" depuis le Backend
async function getWorks() {
    const answer = await fetch("http://localhost:5678/api/works");
    return await answer.json();
}

//Récupère les "Catégories" correspondant aux works récupéré précédement 
async function getCategories() {
    const answer = await fetch("http://localhost:5678/api/categories");
    return await answer.json();
}

//Vérifie la validité des works et prépare leur affichage dans le DOM
async function displayWorks(projects) {
    if (!projects || !Array.isArray(projects)) {
        console.error("No projects data or the response is not an array");
        return; 
    }
    let display = document.querySelector('.gallery');

    for (let i = 0; i < projects.length; i++) {

        displayWorkInGallery(projects[i], display);
    }
}

//Créer les works à afficher dans le DOM. 
async function displayWorkInGallery(project, root) {
    const container = document.createElement('figure');
    const work = document.createElement('figcaption');
    const img = document.createElement('img');
    work.textContent = project.title;
    img.src = project.imageUrl;
    img.alt = project.title;
    root.appendChild(container);
    container.appendChild(img);
    container.appendChild(work);
    container.dataset.id = project.id;
    
}
//Créer les bouton de filtres à appliquer sur les works du DOM 
function createbutton(categories) {
    let portfolio = document.querySelector('.section-head');
    const filters = document.createElement('div');
    filters.classList.add('filters');
    portfolio.appendChild(filters);
    buttoncreation(filters, 'Tous', 0);
    for (let i = 0; i < categories.length; i++) {
        buttoncreation(filters, categories[i].name, categories[i].id);
    }
}
//Gére les boutons à afficher (Filtres ou modifier)
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
//Applique le filtre choisi pour afficher uniquement les works correspondant 
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

//Affiche la banière edit mode si l'utilisateur est connecté 
const editMode = function () {
    const token = localStorage.getItem('token');
    const modeEdition = document.querySelector('.mode-edition');
    const loginbtn = document.getElementById('login');
    const logoutbtn = document.getElementById('logout');
    if (token == null) {
        modeEdition.style.display = 'none';
        loginbtn.classList.remove('off');
        logoutbtn.classList.add('off');
    }
    logoutbtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        location.reload();
    });
}

//Variable utilisée dans plusieurs fonctions 
let modal = null;

//Ouvre la modal 
const openModal = function (e) {
    modal = document.querySelector(e.target.getAttribute('href'))
    console.log('modal');
    page1 = document.getElementById('page1');
    page2 = document.getElementById('add-works');
    page1.classList.add('active');
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.fa-xmark').addEventListener('click', closeModal);
    if (page2.classList.contains('active')) {
        page2.classList.remove('active');
    }
}

//Ferme la modal 
const closeModal = function (e) {
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('add-works');
    const returnBtn = document.getElementById('remove-works');
    if (e.target === modal || e.target.classList.contains('fa-xmark')) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.fa-xmark').removeEventListener('click', closeModal);
        modal = null;
        if (page1.classList.contains('active')) {
            page1.classList.remove('active');
        }
        if (page2.classList.contains('active')) {
            page2.classList.remove('active');
        }
        if (returnBtn.classList.contains('active')) {
            returnBtn.classList.remove('active');
        }
    }

}

//Gére le contenu de la modal 
function modalContent(project) {
    const photoInput = document.getElementById('photo-input');
    const workName = document.getElementById('work-name');
    const categories = document.getElementById('categories');
    const sendBtn = document.getElementById('add-works-btn');
    for (let i = 0; i < project.length; i++) {
        const container = document.getElementById('works-modifiable');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const trash = document.createElement('i');
        img.classList.add('image');
        img.src = project[i].imageUrl;
        img.alt = project[i].title;
        trash.classList.add('fa-solid');
        trash.classList.add('fa-trash-can');
        container.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(trash);
        trash.addEventListener('click', deleteWork);
        trash.dataset.id = project[i].id;
    }
    const inputBtn = document.getElementById('input-button');
    const inputFile = document.getElementById('photo-input')
    inputBtn.addEventListener('click', (e) => {
        inputFile.click();
    })
    const addPhoto = document.querySelector('.add-photo');
    addPhoto.addEventListener('click', (event) => {
        changeModal(1);
    });
    const delPhoto = document.getElementById('remove-works');
    delPhoto.addEventListener('click', (event) => {
        changeModal(2);
    })

    const addWork = document.getElementById('photo-input');
    addWork.addEventListener('change', () => {
        newWorks();
    })
    photoInput.addEventListener("change", checkFormValidity);
    workName.addEventListener("input", checkFormValidity);
    categories.addEventListener("change", checkFormValidity);
    sendBtn.addEventListener("click", submitWorks);

}
//Efface le Work selectioné dans la modal, le DOM et le backend 
async function deleteWork(e) {
    e.preventDefault();
    const workId = e.target.dataset.id;
    const answer = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    });
    if (answer.ok) {
        e.target.parentElement.remove();
        const gallery = document.querySelector('.gallery');
        const delWork = gallery.querySelector(`figure[data-id="${workId}"]`);
        delWork.remove();
    }
    else {
        console.error('Failed to delete work');
    }
}

//Permet la navigation d'une pas à l'autre de la modale 
function changeModal(pageNumber) {
    const page2 = document.getElementById('add-works');
    const page1 = document.getElementById('page1');
    const returnBtn = document.getElementById('remove-works');

    if (pageNumber === 1) {
        page2.classList.add("active");
        page1.classList.remove("active");
        returnBtn.classList.add("active");
    } else {
        page2.classList.remove("active");
        page1.classList.add("active");
        returnBtn.classList.remove("active");
    }
}

//Permet d'ajouter de nouveaux works 
function newWorks() {
    const emptyImg = document.getElementById('empty-image');
    let reader = new FileReader();
    const preview = document.getElementById('new-image');
    let file = document.getElementById('photo-input').files[0];

    reader.addEventListener("load", () => {
        preview.src = reader.result;
       
    },
        false,);
    if (file) {
        preview.style.display = "flex";
        emptyImg.style.display = "none";
        reader.readAsDataURL(file);
    }
}

//Attribue les catégories du backend aux bouton <option> du formulaire 
function formCategories(categories) {
    const form = document.getElementById('categories');
    for (let i = 0; i < categories.length; i++) {
        const options = document.createElement('option');
        options.textContent = categories[i].name;
        options.value = categories[i].id;
        form.appendChild(options);
    }
}

//Vérifie que le formulaire est rempli complètement et correctement 
function checkFormValidity() {
    const photoInput = document.getElementById('photo-input');
    const workName = document.getElementById('work-name');
    const categories = document.getElementById('categories');
    const sendBtn = document.getElementById('add-works-btn');

    if (photoInput.files.length > 0 && workName.value.trim() !== "" && categories.value.trim() !== "") {
        sendBtn.disabled = false;
    }
    else {
        sendBtn.disabled = true;
    }
}

//Ajoute les Works au backennd, au DOM et à la modal 
async function submitWorks(e) {
    e.preventDefault();

    const photoInput = document.getElementById('photo-input');
    const workName = document.getElementById('work-name');
    const categories = document.getElementById('categories');
    const sendBtn = document.getElementById('add-works-btn');
    const emptyImg = document.getElementById('empty-image');
    const preview = document.getElementById('new-image');

    let formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", workName.value.trim());
    formData.append("category", categories.value);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData,
        });

        if (response.ok) {
            photoInput.value = "";
            preview.style.display = "none";
            preview.src = "";
            emptyImg.style.display = "flex";
            workName.value = "";
            categories.value = "";
            sendBtn.disabled = true;
            modal.style.display = 'none';

            const works = await getWorks();
            eraser('.gallery');
            displayWorks(works);
            eraser('.js-works-modifiable');
            modalContent(works);
            
        } else {
            console.error("Failed to upload work");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

//Gére les appels de fonction
async function main() {
    const projects = await getWorks();
    const categories = await getCategories();
    editMode();
    eraser('.gallery');
    createbutton(categories);
    displayWorks(projects);
    document.querySelector('.js-modal').addEventListener('click', openModal)
    modalContent(projects);
    formCategories(categories);
}
main();