
const form = document.getElementById('myForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

function formValidation('submit', e => {
    e.preventdefault();
let email = emailInput.value;
let password = passwordInput.value;

if (email.trim() === '' || password.trim() === '') {
    alert('Please fill in all fields');
    return;
}
else
    SubmitEvent(submit);
) {

}