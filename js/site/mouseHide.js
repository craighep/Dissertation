(function() {
    var mouseTimer;
    var visible = true;

    function hideMouse() {
        mouseTimer = null;
        document.body.style.cursor = "none";
        visible = false;
    }

    document.onmousemove = function() {
        if (mouseTimer) {
            window.clearTimeout(mouseTimer);
        }
        if (!visible) {
            document.body.style.cursor = "default";
            visible = true;
        }
        mouseTimer = window.setTimeout(hideMouse, 3000);
    };
})();