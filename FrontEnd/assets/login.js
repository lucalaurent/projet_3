function formReset() {
    const form = document.getElementById('myForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateForm();
    })
};
async function validateForm() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
    
    if (email === '' || password === '') {
        document.getElementById('loginError').innerHTML = 'Merci de renseigner tous les champs!';
        return false;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
        document.getElementById('loginError').innerHTML = 'Adresse email non valide!';
        return false;
    }
    
    let response = await fetch('http://localhost:5678/api/users/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
    if (response.ok) {
        let data = await response.json();
        let token = data.token;
        localStorage.setItem('token', token);
    }
    else {
        if (response.status === 401) {
            document.getElementById('loginError').innerHTML = 'Mot de Passe incorrect!';              
        }
        if (response.status === 404) {
            document.getElementById('loginError').innerHTML = 'Compte inexistant!';
        }
    }
}
        
// if logged in delete Login text and add logout text. 

    function main() {
        formReset();
    }
   
main();