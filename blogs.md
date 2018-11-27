---
layout: page
title: Blogs
permalink: /blogs/
layout: default
custom_css: blog.css
---

<h1>
    Welcome to my blog where you can read my opinions on:
</h1>

<ul class="blog-list">
    {% for blog in site.blogs %}
      {% if blog.title != "dribble" %}
        {% capture position %}{% cycle 'odd', 'even' %}{% endcapture %}
        {% cycle '<div class="flex-grid">', '' %}
          <li class="col">
            <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
            <span class="post-meta">{{ blog.description }}</span>
          </li>
        {% cycle '', '</div>' %}
      {% endif %}
    {% endfor %}
    {% if position == "odd" %}
      </div>
    {% endif %}
    <!-- Put dribble at the end -->
    {% for blog in site.blogs %}
      {% if blog.title == "dribble" %}
        <div class="flex-grid">
          <li class="col">
            <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
            <span class="post-meta">{{ blog.description }}</span>
          </li>
        </div>
      {% endif %}
    {% endfor %}
</ul>

Coming soon:

*  Hacking is the new warfare
*  Why Magi is a terrible anime
*  Why anime is doomed
*  What makes Radiohead so great
*  How to be an ally?
*  Affirmative action
*  Album cover language
*  Animation is powerful
*  Communism