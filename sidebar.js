document.addEventListener('DOMContentLoaded', (event) => {
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.querySelector('.close-btn');
    const openBtn = document.querySelector('.open-btn');
    const mainContent = document.querySelector('.main-content');

    openBtn.addEventListener('click', () => {
        sidebar.style.left = '0';
        mainContent.style.marginLeft = '250px';
    });

    closeBtn.addEventListener('click', () => {
        sidebar.style.left = '-250px';
        mainContent.style.marginLeft = '0';
    });
});
