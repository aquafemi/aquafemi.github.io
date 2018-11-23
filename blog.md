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
        {% capture position %}{% cycle 'odd', 'even' %}{% endcapture %}
        {% cycle '<div class="flex-grid">', '' %}
          <div class="col">
            <li>
              <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
              <span class="post-meta">{{ blog.description }}</span>
            </li>
          </div>
        {% cycle '', '</div>' %}
      {% endif %}
    {% endfor %}
    {% if position == "odd" %}
      </div>
    {% endif %}
    <!-- Put Dribble at the end -->
    {% for blog in site.blogs %}
      {% if blog.title == "Dribble" %}
        <div class="flex-grid">
          <div class="col">
            <li>
              <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
              <span class="post-meta">{{ blog.description }}</span>
            </li>
          </div>
        </div>
      {% endif %}
    {% endfor %}
</ul>