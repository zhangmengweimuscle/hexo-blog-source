---
title: 目录
date: 2025-07-13 11:49:00
comments: false
---
欢迎来到博客目录页面！这里整理了所有的文章分类和标签，方便您快速找到感兴趣的内容。

## 如何使用目录

- **分类浏览**：查看按主题分类的所有文章
- **标签搜索**：通过标签快速定位相关内容
- **时间排序**：按发布时间浏览文章

这个页面会自动更新，当您添加新文章或分类时，这里会实时显示最新内容。

## 标签云

<div class="tags-cloud">
    <% site.tags.sort('posts.length', -1).forEach(function(tag) { %>
        <a href="javascript:void(0)" class="tag-link" data-tag="<%= tag.name %>" onclick="filterByTag('<%= tag.name %>')">
            <%= tag.name %> <span class="tag-count">(<%= tag.posts.length %>)</span>
        </a>
    <% }) %>
</div>

<div class="tag-filter-container" style="display: none; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    <h3 class="tag-filter-title"></h3>
    <div class="tag-filter-results"></div>
    <button onclick="clearTagFilter()" style="margin-top: 15px; padding: 10px 20px; background: #6b8a9a; color: white; border: none; border-radius: 6px; cursor: pointer;">清除过滤</button>
</div>

## 文章统计

<div style="margin: 30px 0; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="display: flex; justify-content: space-around; text-align: center; flex-wrap: wrap; gap: 20px;">
        <div>
            <div style="font-size: 2rem; font-weight: bold; color: #6b8a9a;"><%= site.posts.length %></div>
            <div style="color: #718096;">总文章数</div>
        </div>
        <div>
            <div style="font-size: 2rem; font-weight: bold; color: #a68b5b;"><%= site.categories.length %></div>
            <div style="color: #718096;">分类数</div>
        </div>
        <div>
            <div style="font-size: 2rem; font-weight: bold; color: #c4a574;"><%= site.tags.length %></div>
            <div style="color: #718096;">标签数</div>
        </div>
    </div>
</div>

## 文章分类

<div class="categories-list">
    <% site.categories.sort('posts.length', -1).forEach(function(category) { %>
        <div class="category-item" data-category="<%= category.name %>">
            <h3>
                <a href="javascript:void(0)" onclick="filterByCategory('<%= category.name %>')"><%= category.name %></a>
                <span class="count">(<%= category.posts.length %>)</span>
            </h3>
            <ul class="category-posts">
                <% category.posts.sort('date', -1).each(function(post) { %>
                    <li data-post-id="<%= post._id %>">
                        <a href="<%- url_for(post.path) %>"><%= post.title %></a>
                        <time><%= date(post.date, 'YYYY-MM-DD') %></time>
                    </li>
                <% }) %>
            </ul>
        </div>
    <% }) %>
</div>

<script>
// Enhanced tag and category filtering with visual effects
let originalPosts = [];

// Store original state
function storeOriginalState() {
    originalPosts = [];
    document.querySelectorAll('.category-item').forEach(categoryItem => {
        const categoryName = categoryItem.getAttribute('data-category');
        const posts = categoryItem.querySelectorAll('.category-posts li');
        
        posts.forEach(post => {
            originalPosts.push({
                element: post,
                title: post.querySelector('a').textContent,
                url: post.querySelector('a').href,
                date: post.querySelector('time').textContent,
                category: categoryName,
                tags: [categoryName],
                originalParent: post.parentNode,
                originalCategory: categoryItem
            });
        });
    });
}

// Enhanced filtering with visual effects
function filterByTag(tagName) {
    performFilter(tagName, '标签');
}

function filterByCategory(categoryName) {
    performFilter(categoryName, '分类');
}

function performFilter(filterName, type) {
    const searchTerm = filterName.toLowerCase();
    
    // Update URL
    const newUrl = window.location.pathname + '?filter=' + encodeURIComponent(filterName);
    window.history.replaceState({filter: filterName}, '', newUrl);
    
    // Hide all categories first
    document.querySelectorAll('.category-item').forEach(item => {
        item.style.display = 'none';
    });
    
    // Show filtered results
    const filteredPosts = originalPosts.filter(post => {
        return post.category.toLowerCase().includes(searchTerm) ||
               post.title.toLowerCase().includes(searchTerm) ||
               post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });
    
    // Create filtered container
    const container = document.querySelector('.tag-filter-container');
    const title = document.querySelector('.tag-filter-title');
    const results = document.querySelector('.tag-filter-results');
    
    if (container && title && results) {
        title.textContent = `${type}: ${filterName} (${filteredPosts.length}篇文章)`;
        
        if (filteredPosts.length === 0) {
            results.innerHTML = `<p style="text-align: center; padding: 20px;">没有找到与"${filterName}"相关的文章</p>`;
        } else {
            results.innerHTML = filteredPosts.map(post => `
                <div style="margin-bottom: 15px; padding: 15px; border-bottom: 1px solid #e8eef2; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="margin: 0 0 8px 0;">
                        <a href="${post.url}" style="color: #6b8a9a; text-decoration: none;">${post.title}</a>
                    </h4>
                    <div style="font-size: 0.9em; color: #718096;">
                        <time>${post.date}</time>
                        <span style="margin-left: 10px;">分类: ${post.category}</span>
                    </div>
                </div>
            `).join('');
        }
        
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Highlight the clicked tag/category
    highlightActiveFilter(filterName);
}

function highlightActiveFilter(filterName) {
    // Highlight tags
    document.querySelectorAll('.tags-cloud .tag-link').forEach(tag => {
        if (tag.textContent.toLowerCase().includes(filterName.toLowerCase())) {
            tag.style.background = '#a68b5b';
            tag.style.transform = 'scale(1.1)';
            tag.style.boxShadow = '0 4px 8px rgba(166, 139, 91, 0.4)';
        } else {
            tag.style.background = '#c4a574';
            tag.style.transform = 'scale(1)';
            tag.style.boxShadow = 'none';
        }
    });
    
    // Highlight categories
    document.querySelectorAll('.category-item h3 a').forEach(cat => {
        if (cat.textContent.toLowerCase().includes(filterName.toLowerCase())) {
            cat.style.color = '#a68b5b';
            cat.style.fontWeight = 'bold';
        } else {
            cat.style.color = '#6b8a9a';
            cat.style.fontWeight = 'normal';
        }
    });
}

function clearTagFilter() {
    const container = document.querySelector('.tag-filter-container');
    if (container) {
        container.style.display = 'none';
    }
    
    // Show all categories
    document.querySelectorAll('.category-item').forEach(item => {
        item.style.display = 'block';
    });
    
    // Reset highlights
    document.querySelectorAll('.tags-cloud .tag-link').forEach(tag => {
        tag.style.background = '#c4a574';
        tag.style.transform = 'scale(1)';
        tag.style.boxShadow = 'none';
    });
    
    document.querySelectorAll('.category-item h3 a').forEach(cat => {
        cat.style.color = '#6b8a9a';
        cat.style.fontWeight = 'normal';
    });
    
    // Clear URL parameter
    window.history.replaceState({}, '', window.location.pathname);
}

// Auto-filter on page load with visual effects
document.addEventListener('DOMContentLoaded', function() {
    storeOriginalState();
    
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam) {
        setTimeout(() => {
            performFilter(filterParam, '标签');
            highlightActiveFilter(filterParam);
        }, 200);
    }
});

// Add click handlers for tags and categories
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to tags
    document.querySelectorAll('.tags-cloud .tag-link').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagName = this.getAttribute('data-tag');
            filterByTag(tagName);
        });
    });
    
    // Add click handlers to categories
    document.querySelectorAll('.category-item h3 a').forEach(cat => {
        cat.addEventListener('click', function() {
            const categoryName = this.textContent.replace(/\(\d+\)/, '').trim();
            filterByCategory(categoryName);
        });
    });
});
</script>
