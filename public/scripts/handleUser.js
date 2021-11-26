const loginAndRegisterButton = document.getElementById("loginAndRegisterButton");
loginAndRegisterButton.addEventListener("click", openLoginAndRegistration);


//Dgmara
//show div for login and register hide menu 
function openLoginAndRegistration() {
  document.getElementById("loginAndRegister").style.display = "block";
  document.getElementById("menuOptions").style.display = "block";
  document.getElementById("panel").style.display = "none";
  document.getElementById("highscore").style.display = "none";
  document.getElementById("gameScreen").style.display = "none";
}

//Dagmara
//reset fields
function resetLoginFields () {
    username.value = '';
    password.vaule = '';
}

//Dagmara
//function to login into the game and set session with player id, sent request to server to check uf username and password exists
async function login() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username.value, password: password.value }),
  });
  resetLoginFields(username, password);
  const result = await response.json();
  if (result.playerId && result.username) {
    const sessionResult = await setSession(result.playerId, result.username);
    if (sessionResult.playerId && sessionResult.username) {
      document.getElementById("loggedInUser").innerText = `Logged: ${sessionResult.username}`;
      showMainMenu();
      changeButtonToLogout();
    }
  }
}

//Dagmara 
//hide login and register show main menu
function showMainMenu(){
  document.getElementById("panel").style.display = "block";
  document.getElementById("menuOptions").style.display = "none";

}

//Dagmara
//begin login procedure
function activateLogin() {
  changeButtonToLogin();
}

//Dagmara
//begin register procedure
function activateRegistartion() {
  document.getElementById("loginAndRegisterHeadder").innerText = "Register";
  document.getElementById("registerButton").setAttribute("onclick", "register()");
  document.getElementById("repeatPassword").style.display = "inline-block";
  document.getElementById("loginButton").setAttribute("onclick", "activateLogin()");
}

//Dagmara
//begin logout procedure
function changeButtonToLogout() {
  document.getElementById("loginAndRegister").style.display = "none";
  document.getElementById("loginAndRegisterHeadder").innerText = "Logout";
  document.getElementById("loginButton").innerText = "Logout";
  document.getElementById("loginButton").setAttribute("onclick", "logout()");
}

//Dagmara
//begin login procedure
function changeButtonToLogin() {
  document.getElementById("repeatPassword").style.display = "none";
  document.getElementById("loginAndRegisterHeadder").innerText = "Login";
  document.getElementById("loginButton").innerText = "Login";
  document.getElementById("loginButton").setAttribute("onclick", "login()");
  document.getElementById("registerButton").setAttribute("onclick", "activateRegistartion()");
}

//Dagmara
//funtion to register new user and send request to server to check and add user to db
async function register() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const repeatPassword = document.getElementById('repeatPassword');
  if (password.value !== repeatPassword.value) {
    document.getElementById('message').innerText = 'Passwords have to match. Try again';
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
  resetLoginFields(username, password);
  const result = await response.json();
  document.getElementById('message').innerText = result.message;
}

//Dagmara
//destroy session and call method to display login 
async function logout() {
  const response = await fetch('/destroysession', {
    method: 'DELETE',
  });
  const result = await response.json();
  if (result.message === 'Session destroyed') {
    changeButtonToLogin();
    document.getElementById("loggedInUser").innerText = '';
  } else {
    alert(result.message);
  }
}

//Dagmara
//add listener for span element in main menu to logout user
document.getElementById("loggedInUser").addEventListener("click",logout);

//Dagmara
//set playerId from db and username to session
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

//Marianna
//check if session is set
window.addEventListener("load", () => {
    checkSession();
});

//Marianna & Dagmara
//if session set enable logout, if not login
async function checkSession() {
    let result = await getSession();
    if (result.playerId && result.username) {
      document.getElementById("loggedInUser").innerText = `Logged: ${result.username}`;
      changeButtonToLogout();
    } else {
      changeButtonToLogin();
      document.getElementById("loggedInUser").innerText = '';
    }
}

//Dagmara
async function getSession() {
  const response = await fetch('/getsession');
  return await response.json();
}