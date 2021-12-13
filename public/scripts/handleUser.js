// Dgmara
// show div for login and register hide menu
function openLoginAndRegistration() {
  $('#loginAndRegister').css('display', 'block');
  $('#menuOptions').css('display', 'block');
  $('#panel').css('display', 'none');
  $('#highscore').css('display', 'none');
  $('#gameScreen').css('display', 'none');
  $('#roomCodeScreen').css('display', 'none');
  createLoginAndgisterScreen();
}

function createLoginAndgisterScreen() {
  if (!$("#loginAndRegister").children().length) {
  $("#loginAndRegister").append(`
      <h1 id="loginAndRegisterHeadder" class="gameTitle">LOGIN</h1>
      <form>
          <input placeholder="USERNAME" type="text" id="username" name="username"><br>
          <input placeholder="PASSWORD" type="password" id="password" name="password"><br>
          <input placeholder="REPEAT PASSWORD" type="password" id="repeatPassword" name="repeatPassword"><br>
      </form>
      <div id="buttonControl">
          <button type="button" id="loginButton" class="btn" onClick="login()">LOGIN</button>
          <button type="button" id="registerButton" class="btn" onClick="activateRegistartion()">REGISTER</button>
      </div> 
      <p id="message"></p>
    `)
  }
  
}


// Dagmara
// reset fields
function resetLoginFields() {
  $('#username').val('');
  $('#password').val('');
}

// Dagmara
// hide login and register show main menu
function showMainMenu() {
  $('#panel').css('display', 'block');
  $('#menuOptions').css('display', 'none');
}

// Dagmara
// begin register procedure
function activateRegistartion() {
  $('#loginAndRegisterHeadder').text('REGISTER');
  $('#registerButton').attr('onclick', 'register()');
  $('#repeatPassword').css('display', 'inline-block');
  $('#loginButton').attr('onclick', 'activateLogin()');
}

// Dagmara
// begin logout procedure
function changeButtonToLogout() {
  $('#loginAndRegister').css('display', 'none');
  $('#loginAndRegisterHeadder').text('LOGOUT');
  $('#loginButton').text('LOGUT');
  $('#loginButton').attr('onclick', 'logout()');
}

// Dagmara
// begin login procedure
function changeButtonToLogin() {
  $('#repeatPassword').css('display', 'none');
  $('#loginAndRegisterHeadder').text('LOGIN');
  $('#loginButton').text('LOGIN');
  $('#loginButton').attr('onclick', 'login()');
  $('#registerButton').attr('onclick', 'activateRegistartion()');
}

// Dagmara
// set playerId from db and username to session
async function setSession(playerId, username) {
  const response = await fetch('/setsession', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerId, username }),
  });
  const result = await response.json();
  return result;
}

// Dagmara
// begin login procedure
function activateLogin() {
  changeButtonToLogin();
}

// Dagmara
// function to login into the game and set session with player id, sent request to server to check uf username and password exists
async function login() {
  const username = $('#username').val();
  const password = $('#password').val();
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  resetLoginFields();
  const result = await response.json();
  if (result.playerId && result.username) {
    const sessionResult = await setSession(result.playerId, result.username);
    if (sessionResult.playerId && sessionResult.username) {
      $('#loggedInUser').text(`Logged: ${sessionResult.username}`);
      showMainMenu();
      changeButtonToLogout();
    }
  }
}

// Dagmara
// funtion to register new user and send request to server to check and add user to db
async function register() {
  const username = $('#username').val();
  const password = $('#password').val();
  const repeatPassword = $('#repeatPassword').val();
  if (password !== repeatPassword) {
    $('#message').text('Passwords have to match. Try again');
    return;
  }
  const response = await fetch('/api/users/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  $('#repeatPassword').val('');
  const result = await response.json();
  $('#message').text(result.message);
  activateLogin();
}

// Dagmara
// destroy session and call method to display login
async function logout() {
  const response = await fetch('/destroysession', {
    method: 'DELETE',
  });
  const result = await response.json();
  if (result.message === 'Session destroyed') {
    leaveGame();
    changeButtonToLogin();
    $('#loggedInUser').text('');
  } else {
    alert(result.message);
  }
}

// Dagmara
// add listener for span element in main menu to logout user
$('#loggedInUser').on('click', logout);

// Dagmara
async function getSession() {
  const response = await fetch('/getsession');
  return response.json();
}

// Marianna & Dagmara
// if session set enable logout, if not login
async function checkSession() {
  const result = await getSession();
  if (result.playerId && result.username) {
    $('#loggedInUser').text(`Logged: ${result.username}`);
    changeButtonToLogout();
  } else {
    changeButtonToLogin();
    $('#loggedInUser').text('');
  }
}

//Dagmara
async function destroySession() {
  const response = await fetch('/destroysession', {
    method: 'DELETE',
  });
  const result = await response.json();
  if (!result.isDestroyed) {
    await checkSession();
  }
  
}

// Marianna & Dagmara
// check if session is set
$(window).on('load', () => {
  $('#loginAndRegisterButton').on('click', openLoginAndRegistration);
  $('#highscoreButton').on('click', openHighscores);
  $('#interactionsButton').on('click', openInteractions);
  destroySession();
});
