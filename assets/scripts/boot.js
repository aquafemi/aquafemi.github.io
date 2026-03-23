(function () {
    const STORAGE_KEY = 'femi_xyz_booted';

    const bootScreen = document.getElementById('boot-screen');
    const loginScreen = document.getElementById('login-screen');
    const progressBar = document.getElementById('boot-progress-bar');

    function runBoot() {
        // Reset state
        bootScreen.style.display = 'flex';
        bootScreen.style.opacity = '1';
        bootScreen.classList.remove('fade-out');
        loginScreen.style.display = 'none';
        loginScreen.classList.remove('visible', 'fade-out');
        progressBar.classList.remove('animating');
        progressBar.style.width = '0%';

        const FILL_MS = 4000;
        setTimeout(() => {
            progressBar.classList.add('animating');
            setTimeout(showLogin, FILL_MS + 300);
        }, 600);
    }

    function showLogin() {
        bootScreen.classList.add('fade-out');
        loginScreen.style.display = 'flex';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                loginScreen.classList.add('visible');
            });
        });
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 700);
    }

    window.doLogin = function () {
        loginScreen.classList.add('fade-out');
        sessionStorage.setItem(STORAGE_KEY, '1');
        setTimeout(() => {
            loginScreen.style.display = 'none';
        }, 600);
    };

    window.doLogOff = function () {
        sessionStorage.removeItem(STORAGE_KEY);
        loginScreen.style.display = 'flex';
        loginScreen.classList.remove('fade-out');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                loginScreen.classList.add('visible');
            });
        });
    };

    window.doRestart = function () {
        sessionStorage.removeItem(STORAGE_KEY);
        runBoot();
    };

    // Skip boot sequence if already seen this session
    if (sessionStorage.getItem(STORAGE_KEY)) {
        bootScreen.style.display = 'none';
        loginScreen.style.display = 'none';
        return;
    }

    runBoot();
})();
