//MOST OF THE CODE TAKEN FROM FOOD-APP PROJECT WRITTEN BY MARIANNA: SET LOGIN, SET LOGOUT HTML, REGISTERSTART, LOGINSTART, etc.

//Dagmara
function resetLoginFields () {
    username.value = '';
    password.vaule = '';
}

//Dagmara
//function to login into the game and set session with player id, sent request to server to check uf username and password exists
async function login() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  resetLoginFields(username, password);
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username.value, password: password.value }),
  });
  const result = await response.json();
  if (result.playerId) {
    const sessionResult = await setSession(result.playerId, result.username);
    if (sessionResult.playerId && sessionResult.username) {
      $('#loginModal').modal('hide');
      setLogoutHtml();
    }
  }
  $('#message').text(result.message);
}

//Dagmara
//displays for user ability to register
function registerStart() {
  $('#repeatPasswordLabel').show();
  $('#repeatPassword').show();
  $('#register').attr('onclick', 'register()').removeClass('btn-secondary').addClass('btn-primary');
  $('#loginButton').attr('onclick', 'loginStart()').addClass('btn-secondary').removeClass('btn-primary');
  $('.modal-title').text('Register');
}

//Dagmara
//displays for user ability to login 
function loginStart() {
  $('#repeatPasswordLabel').hide();
  $('#repeatPassword').hide();
  $('#register').attr('onclick', 'registerStart()').addClass('btn-secondary').removeClass('btn-primary');
  $('#loginButton').attr('onclick', 'login()').removeClass('btn-secondary').addClass('btn-primary');
  $('.modal-title').text('Login');
}

//Dagmara
//funtion to register new user and send request to server to check and add user to db
async function register() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  resetLoginFields(username, password);
  const repeatPassword = document.getElementById('repeatPassword');
  if (password.value !== repeatPassword.value) {
    $('#message').text('Passwords have to match. Try again');
    return;
  }
  const response = await fetch('/api/user/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username.value, password: password.value }),
  });
  const result = await response.json();
  $('#message').text(result.message);
}

//Dagmara
//destroy session and call method to display login 
async function logout() {
  const response = await fetch('/destroysession', {
    method: 'DELETE',
  });
  const result = await response.json();
  if (result.message === 'Session destroyed') {
    setLoginHtml();
  } else {
    alert(result.message);
  }
}

//Dagmara
function setLoginHtml() {
  $('#login-style').text('Login').attr({ 'data-target': '#loginModal', 'data-toggle': 'modal' }).removeAttr('onClick');
}

//Dagmara
function setLogoutHtml() {
  $('#login-style').text('Logout').removeAttr('data-target data-toggle').attr('onClick', 'logout();');
}

//Dagmara
async function setSession(playerId, username) {
  const response = await fetch('/setsession', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerId: playerId, username:username }),
  });
  const result = await response.json();
  return result;
}

window.addEventListener("load", () => {
    checkSession();
});

async function checkSession() {
    response = await fetch('/getsession');
    result = await response.json();
    if (result.playerId && result.username) {
        setLogoutHtml(response);
    } else {
        setLoginHtml();
    }
}