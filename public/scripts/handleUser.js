// Dgmara
// show div for login and register hide menu
function openLoginAndRegistration() {
  $("#loginMessage").remove();
  $('#loginAndRegister').css('display', 'block');
  $('#menuOptions').css('display', 'block');
  $('#panel').css('display', 'none');
  $('#highscore').css('display', 'none');
  $('#gameScreen').css('display', 'none');
  $('#roomCodeScreen').css('display', 'none');
  $('#interactionForm').css('display', 'none');
  createLoginAndgisterScreen();
  $('#loggedInUserIcon').css('display', 'none');
}

function createLoginAndgisterScreen() {
  if (!$("#loginAndRegister").children().length) {
  $("#loginAndRegister").append(`
      <h1 id="loginAndRegisterHeadder" class="gameTitle">LOGIN</h1>
      <form>
          <div class="inputBigButton backgroundPicture bigButton"><input class="buttonText brownText" placeholder="USERNAME" type="text" id="username" name="username"></div>
          <div class="inputBigButton backgroundPicture bigButton"><input class="buttonText brownText" placeholder="PASSWORD" type="password" id="password" name="password"></div>
          <div id="repeatPasswordDiv"class="inputBigButton backgroundPicture bigButton"><input class="buttonText brownText" placeholder="REPEAT PASSWORD" type="password" id="repeatPassword" name="repeatPassword"></div>
      </form>
      <div class="buttonControl">
          <button type="button" id="loginButton" class="backgroundPicture smallButton" onClick="login()"><span id="loginButtonText" class="buttonText orangeText">LOGIN</span></button>
          <button type="button" id="registerButton" class="backgroundPicture smallButton" onClick="activateRegistartion()"><span class="buttonText orangeText">REGISTER</span></button>
      </div> 
    `)
  }
  
}

// Dagmara
// If username is invalid the user is promped to enter different username
function invalidInput(message = '') {
  if ($("#loginMessage")){
    $("#loginMessage").remove();
  }
  if (message) {
    $('#loginAndRegister form').append(`<span id="loginMessage">${message}</span>`);
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
  if ($('#loggedInUser').text() !== '') {
    $('#loggedInUserIcon').css('display', 'block');
  }
  $('#returnToMainMenuButton').removeClass('highscoreReturnToMainButton');
  $('#returnToMainMenuButton').removeClass('interactionsReturnToMainButton');
  $('#showHelp').css('display', 'none');
  $('#returnToMainMenuButton').css('display', 'block');
}

// Dagmara
// begin register procedure
function activateRegistartion() {
  $("#loginMessage").remove();
  $('#loginAndRegisterHeadder').text('REGISTER');
  $('#registerButton').attr('onclick', 'register()');
  $('#repeatPasswordDiv').css('display', 'block');
  $('#loginButton').attr('onclick', 'activateLogin()');
}

// Dagmara
// begin logout procedure
function changeButtonToLogout() {
  $('#loginAndRegister').css('display', 'none');
  $('#loginAndRegisterHeadder').text('LOGOUT');
  $('#loginButtonText').text('LOGOUT');
  $('#loginButton').attr('onclick', 'logout()');
}

// Dagmara
// begin login procedure
function changeButtonToLogin() {
  $('#repeatPasswordDiv').css('display', 'none');
  $('#loginAndRegisterHeadder').text('LOGIN');
  $('#loginButtonText').text('LOGIN');
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
      $('#loggedInUser').text(`Hey ${sessionResult.username}, welcome back`);
      $('#loggedInUserIcon').css('display','block');
      showMainMenu();
      changeButtonToLogout();
    }
  } else {
    invalidInput(result.message);
  }

}

// Dagmara
// funtion to register new user and send request to server to check and add user to db
async function register() {
  $("#loginMessage").remove();
  const username = $('#username').val();
  const password = $('#password').val();
  const repeatPassword = $('#repeatPassword').val();
  if (password !== repeatPassword) {
    invalidInput('Passwords have to match. Try again');
    $('#loginMessage').css('padding-top', '0');
    resetLoginFields();
    $('#repeatPassword').val('');
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
  if (result.message === 'User added successfully.') {
    activateLogin();
  } else {
    resetLoginFields();
    invalidInput(result.message);
    $('#loginMessage').css('padding-top', '0');
  }
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
    $('#loggedInUserIcon').css('display, none');
  } else {
    alert(result.message);
  }
}

// Dagmara
// add listener for span element in main menu to logout user
$('#loggedInUserIcon').on('click', logout);

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
    $('#loggedInUser').text(`Hey ${sessionResult.username}, welcome back`);
    $('#loggedInUserIcon').css('display','block');
    changeButtonToLogout();
  } else {
    changeButtonToLogin();
    $('#loggedInUser').text('');
    $('#loggedInUserIcon').css('display, none');
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
