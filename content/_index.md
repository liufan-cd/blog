---
title: 'Home'
date: 2025-08-04
type: landing
show_date: false
reading_time: false
sections:
  - block: resume-biography
    content:
      # The user's folder name in content/authors/
      username: admin
    design:
      spacing:
        padding: [0, 0, 0, 0]
      biography:
        style: 'text-align: justify; font-size: 1em;'
  - block: collection
    id: blog
    content:
      title: 博客
      text: '没事干写的博客'
      # Choose how many pages you would like to display (0 = all pages)
      count: 12
      # Filter on criteria
      filters:
        # The folders to display content from
        folders:
          - blog
        author: ""
        category: ""
        tag: ""
        publication_type: ""
        featured_only: false
        exclude_featured: false
        exclude_future: false
        exclude_past: false
      # Choose how many pages you would like to offset by
      # Useful if you wish to show the first item in the Featured widget
      offset: 0
      # Field to sort by, such as Date or Title
      sort_by: 'Date'
      sort_ascending: false
    design:
      # Choose a listing view
      view: Showcase
      columns: 4
      len: 12
      fill_image: false
---