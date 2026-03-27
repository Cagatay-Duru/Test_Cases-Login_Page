(function () {
    'use strict';

    var VALID_USERNAME = 'admin';
    var VALID_PASSWORD = 'Admin1234';
    var PASSWORD_MIN = 8;
    var PASSWORD_MAX = 12;

    function isSQLInjection(input) {
        return input.indexOf("' OR '1'='1") !== -1;
    }

    var loginForm = document.getElementById('loginForm');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var usernameError = document.getElementById('usernameError');
    var passwordError = document.getElementById('passwordError');
    var usernameGroup = document.getElementById('usernameGroup');
    var passwordGroup = document.getElementById('passwordGroup');
    var alertMessage = document.getElementById('alertMessage');
    var loginContainer = document.getElementById('loginContainer');
    var dashboardContainer = document.getElementById('dashboardContainer');
    var welcomeText = document.getElementById('welcomeText');

    function setError(group, errorEl, message) {
        group.classList.add('error');
        errorEl.textContent = message;
    }

    function clearError(group, errorEl) {
        group.classList.remove('error');
        errorEl.textContent = '';
    }

    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = 'alert-message show ' + type;
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        clearError(usernameGroup, usernameError);
        clearError(passwordGroup, passwordError);

        var username = usernameInput.value.trim();
        var password = passwordInput.value;

        // Empty fields
        if (username === '' && password === '') {
            setError(usernameGroup, usernameError, 'Fields cannot be empty');
            setError(passwordGroup, passwordError, 'Fields cannot be empty');
            showAlert('Fields cannot be empty', 'error');
            return;
        }
        if (username === '') {
            setError(usernameGroup, usernameError, 'Fields cannot be empty');
            showAlert('Fields cannot be empty', 'error');
            return;
        }
        if (password === '') {
            setError(passwordGroup, passwordError, 'Fields cannot be empty');
            showAlert('Fields cannot be empty', 'error');
            return;
        }

        // SQL Injection
        if (isSQLInjection(username) || isSQLInjection(password)) {
            setError(usernameGroup, usernameError, 'Potential SQL injection detected');
            showAlert('SQL injection attempt detected!', 'error');
            return;
        }

        // Password length validation
        if (password.length < PASSWORD_MIN) {
            setError(passwordGroup, passwordError,
                'Password must be at least ' + PASSWORD_MIN + ' characters (currently ' + password.length + ')');
            showAlert('Password does not meet length requirements', 'error');
            return;
        }
        if (password.length > PASSWORD_MAX) {
            setError(passwordGroup, passwordError,
                'Password must be at most ' + PASSWORD_MAX + ' characters (currently ' + password.length + ')');
            showAlert('Password does not meet length requirements', 'error');
            return;
        }

        // Valid login
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            loginContainer.style.display = 'none';
            dashboardContainer.style.display = 'block';
            welcomeText.textContent = 'Welcome, ' + username + '! You have successfully logged in.';
            return;
        }

        // Invalid credentials
        showAlert('Invalid credentials', 'error');
    });

    usernameInput.addEventListener('focus', function () {
        clearError(usernameGroup, usernameError);
    });

    passwordInput.addEventListener('focus', function () {
        clearError(passwordGroup, passwordError);
    });

})();
