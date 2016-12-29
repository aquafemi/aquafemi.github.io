$(function() {
    var favicon = $('#favicon');
    console.log('heere');
    // TweenLite.to(favicon, 0.7, {left: 0, x: 0});
    TweenLite.fromTo(favicon, 2, {x: '-=200px'},
        {x: 150, ease:Power4.easeInOut, onStart: start, onUpdate: update, onComplete: complete});

    function start(){
        console.log('start');
    }
    function update(){
        console.log('animating');
    }
    function complete(){
        console.log('end');
    }
});
