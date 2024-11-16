(function() {
    window.addEventListener('load', function() {
        var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        var loadTimeSec = (loadTime / 1000).toFixed(3);

        var loadTimeElement = document.getElementById('load-time');
        loadTimeElement.innerText = 'Page load time: ' + loadTimeSec + ' секунд.';
    });
})();