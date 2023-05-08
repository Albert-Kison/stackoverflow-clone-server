console.log("Login form");
//when user press formElement button it sends email and password to mongo to login
const formElement = document.getElementById('loginForm'); 
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const User = {
    email: email,
    password: password
  }
  // sends post request and returns user-info and puts it in a local storage.
  fetch("https://protected-hamlet-05766.herokuapp.com/api/signin",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      email:User.email,
      password:User.password
    })
})
.then((res) => {
    if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
    }
     return res.json();
})
.then((data) => {
    if (data.token) {
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('admin',data.isAdmin);
        localStorage.setItem('name',data.name);
        window.location.href = 'index.html';
    }
})
});

