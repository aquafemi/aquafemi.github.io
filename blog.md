---
layout: page
title: Blog
permalink: /blog/
layout: default
custom_css: blog.css
---

<h1>
    Welcome to my blog where you can read my opinions on:
</h1>

<ul class="blog-list">
  {% for blog in site.blogs %}
    {% if blog.title != "Dribble" %}
      <li>
        <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
        <span class="post-meta">{{ blog.description }}</span>
      </li>
    {% endif %}
  {% endfor %}

  <!-- Put Dribble at the end -->
  {% for blog in site.blogs %}
    {% if blog.title == "Dribble" %}
      <li>
        <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
        <span class="post-meta">{{ blog.description }}</span>
      </li>
    {% endif %}
  {% endfor %}
</ul>