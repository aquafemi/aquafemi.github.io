---
layout: default
title: Timeline
permalink: /timeline/
custom_js: index.js
---

<div style="display: flex;">
    <div>
      <div id="slider"></div>
    </div>

    <div style="flex-grow: 1;">
        {% for event in site.data.timeline %}
            <div class="timeline-event" data-toggle="tooltip" title="{{ event.description }}">
            <h2>{{ event.name }}</h2>
            <p>{{ event.time }}</p>
            <p>{{ event.location }}</p>
            </div>
        {% endfor %}
    </div>
  </div>