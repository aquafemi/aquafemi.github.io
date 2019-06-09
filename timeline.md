---
layout: default
title: Timeline
permalink: /timeline/
custom_js: 
- ScrollMagic.min.js
- animation.gsap.min.js
- debug.addIndicators.min.js
- timeline.js
---

{%- assign num_events = site.data.timeline.size | minus: 1 -%}
{%- include timeline.html preview=false num_events=num_events -%}