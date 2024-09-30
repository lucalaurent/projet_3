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

    //Checker expression reguliere pour email. 
    
    
    if (email === '' || password === '') {
        alert('Incorrect email or password! Please try again.  ');
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
            alert('Mot de Passe incorrect!');
        }
        if (response.status === 404) {
            alert('Email non trouvé!');
        }
    }
}
        
// if logged in delete Login text and add logout text. 

    function main() {
        formReset();
    }
   
main();