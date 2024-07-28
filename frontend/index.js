// Set login form elements based on ids
const initial_login = document.getElementById('initial_login');
const user_login = document.getElementById('user_login');
const admin_login = document.getElementById('admin_login');

// Remove form elements until needed
user_login.remove();
admin_login.remove();

const login_type = (login_string) => {
    if (login_string == 'user') {
        initial_login.replaceWith(user_login);
        user_login.style.visibility = "visible";
    } else if (login_string == 'admin') {
        initial_login.replaceWith(admin_login);
        admin_login.style.visibility = "visible";
    }
}

const login = (login_string) => {
    if (login_string == 'user') {
        const user_code = document.getElementById('user_code').value;

        if (user_code == '123') {
            window.location.href = "pages/user.html";
        } else {
            alert("User does not exist");
        }
    } else if (login_string == 'admin') {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username == 'admin' && password == 'admin') {
            window.location.href = "pages/admin.html";
        } else {
            alert("Incorrect credentials. Please try again.");
        }
    }
}