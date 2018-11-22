---
layout: page
title: Blog
permalink: /blog/
layout: default
custom_css: blog.css
---

<h1>
    Welcome to my blog. Read my opinions on:
</h1>

<ul class="blog-list">
  {% for blog in site.blog %}
      {% if blog.title != "Dribble" %}
        <li>
          <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
          {{ blog.description }}
        </li>
      {% endif %}
  {% endfor %}

  {% for blog in site.blog %}
    {% if blog.title == "Dribble" %}
      <li>
        <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
        {{ blog.description }}
      </li>
    {% endif %}
  {% endfor %}
</ul>