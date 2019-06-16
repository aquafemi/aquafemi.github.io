$(function() {

    // Style toggle tooltips.
    $('[data-toggle="tooltip"]').tooltip({delay: {hide: 3000}});

    var timelineEvents = $(".timeline-event");
    var controller = new ScrollMagic.Controller();

    for (var i = 0; i < timelineEvents.length; i++) {
        var tween = new TimelineLite()
            .from(timelineEvents[i], 1, {x: '-=100', autoAlpha: 0, ease:Power1.easeInOut});
        new ScrollMagic.Scene({
            triggerElement: timelineEvents[i],
            offset: 50,
            triggerHook: "onEnter",
            duration: "50%"
        })
        .setTween(tween)
        .addTo(controller);
    }

});
