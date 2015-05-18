window.onload = function() {
    var canvas = document.getElementById("main"),
        context = canvas.getContext('2d'),
        ball = new Ball();
    angle = 0;
    ball.x = canvas.width /2;
    ball.y = canvas.height/2;
    (function drawFrame() {
        window.requestAnimationFrame(drawFrame, canvas);
        context.clearRect(0,0,canvas.width,canvas.height);

        ball.y = canvas.height / 2 + Math.sin(angle) * 50;
        angle += 0.1;
        ball.draw(context);
    }());
}