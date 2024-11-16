(function() {
    const currentPath = document.location.pathname;
    const menuLinks = currentPath.split('/');
    const menuLink = "menu_" + menuLinks[menuLinks.length - 1].split('.')[0];
    const menuPage = document.getElementById(menuLink);

    if (menuPage == null) {
        console.log("Page: " + menuLink + " not found");
        return;
    }

    menuPage.classList.add('active');
    console.log(menuLink);
})();