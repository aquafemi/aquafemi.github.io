$(function() {

    var timelineBoxes = $(".timeline-event, .timeline-line");
    var tl = new TimelineLite({
        onUpdate: updateSlider
    });

    // Create a Slider to Control Playback
    $("#slider").slider({
        range: false,
        min: 0,
        max: 100,
        step: .1,
        slide: function(event, ui) {
            tl.pause();
            //adjust the timeline’s progress() based on slider value
            tl.progress(ui.value / 100);
        }
    });

    // updateSlider function
    function updateSlider() {
        $("#slider").slider("value", tl.progress() * 100);
    }

    tl.staggerFrom(timelineBoxes, 1, {x: '-=100', autoAlpha: 0, ease:Power4.easeInOut}, 0.5);

});
