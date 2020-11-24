function toggleResetPswd(e) {
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-reset').toggle(); // display:block or none
  }
  
  function toggleSignUp(e) {
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-signup').toggle(); // display:block or none
  }
  
  $(() => {
    // Login Register Form
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
    $('#logreg-forms #btn-signup').click(toggleSignUp);
    $('#logreg-forms #cancel_signup').click(toggleSignUp);
  });
  
  ///////////////////////////////// BACKEND ////////////////////////////////////////////////////////////
  
  // Login
  document.querySelector('.form-signin').onsubmit = async function (e) {
    e.preventDefault();
    try {
      const email = e.target.inputEmail.value;
      const password = e.target.inputPassword.value;
  
      if (!email && !password) {
        throw new Error('Invalid Email or Password!');
      }
  
      console.log(email, password);
  
      // Calling Fetch API
  
      const resp = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
  
        credentials: 'include',
        mode: 'cors',
      });
  
      respJSON = await resp.json();
      if (respJSON.status === 'success' && respJSON.token) {
        window.location.href = './index.html';
      }
    } catch (err) {
      alert(err.message);
    }
  };
  
  //SignUp
  
  document.querySelector('.form-signup').onsubmit = async function (e) {
    e.preventDefault();
    try {
      const name = e.target.userName.value;
      const email = e.target.userEmail.value;
      const password = e.target.userPassword.value;
      const passwordConfirm = e.target.userPasswordConfirm.value;
  
      console.log(email, password, passwordConfirm, name);
  
      // Calling Fetch API
  
      const resp = await fetch('/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, passwordConfirm }),
  
        credentials: 'include',
        mode: 'cors',
      });
      respJSON = await resp.json();
      if (respJSON.status === 'success' && respJSON.token) {
        window.location.href = './index.html';
        console.log(window.location.href);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  