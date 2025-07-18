// Main JavaScript for Moonshot Test Theme

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Add reading progress indicator for posts
    if (document.querySelector('.post-content')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: #007acc;
            z-index: 1000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const postContent = document.querySelector('.post-content');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = postContent.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }

    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #007acc;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);

        pre.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });

        pre.addEventListener('mouseleave', () => {
            button.style.opacity = '0';
        });

        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = '已复制!';
                setTimeout(() => {
                    button.textContent = '复制';
                }, 2000);
            });
        });
    });

    // Add smooth scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        font-weight: 500;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Search functionality for catalog page
    if (document.querySelector('.catalog-content')) {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const clearButton = document.getElementById('clear-button');
        const searchResults = document.getElementById('search-results');
        const resultsContainer = document.getElementById('results-container');
        const searchCount = document.getElementById('search-count');
        const catalogSections = document.getElementById('catalog-sections');

        // Collect all posts data from the page
        const allPosts = [];

        // Get posts from categories
        document.querySelectorAll('.category-item').forEach(categoryItem => {
            const categoryName = categoryItem.getAttribute('data-category');
            const posts = categoryItem.querySelectorAll('.category-posts li');
            
            posts.forEach(post => {
                const title = post.querySelector('a').textContent;
                const url = post.querySelector('a').href;
                const date = post.querySelector('time').textContent;
                const postId = post.getAttribute('data-post-id');

                allPosts.push({
                    id: postId,
                    title: title,
                    url: url,
                    date: date,
                    category: categoryName,
                    tags: [],
                    content: ''
                });
            });
        });

        // Search functionality
        function performSearch(query) {
            if (!query.trim()) {
                clearSearch();
                return;
            }

            const searchTerm = query.toLowerCase();
            const results = [];

            // Search in titles, categories, and tags
            allPosts.forEach(post => {
                let score = 0;
                let highlights = {
                    title: post.title,
                    content: '',
                    tags: []
                };

                // Search in title
                if (post.title.toLowerCase().includes(searchTerm)) {
                    score += 10;
                    highlights.title = highlightText(post.title, searchTerm);
                }

                // Search in category
                if (post.category && post.category.toLowerCase().includes(searchTerm)) {
                    score += 5;
                }

                // Search in tags (if available)
                if (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
                    score += 3;
                }

                if (score > 0) {
                    results.push({
                        ...post,
                        score,
                        highlights
                    });
                }
            });

            // Sort by score (highest first)
            results.sort((a, b) => b.score - a.score);

            displayResults(results, query);
        }

        function highlightText(text, searchTerm) {
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            return text.replace(regex, '<span class="search-highlight">$1</span>');
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function displayResults(results, query) {
            if (results.length === 0) {
                resultsContainer.innerHTML = '<div class="no-results">没有找到匹配的文章</div>';
                searchCount.textContent = '(0)';
            } else {
                searchCount.textContent = `(${results.length})`;
                
                const resultsHTML = results.map(result => `
                    <div class="search-result-item">
                        <h4 class="search-result-title">
                            <a href="${result.url}">${result.highlights.title}</a>
                        </h4>
                        <div class="search-result-meta">
                            <time>${result.date}</time>
                            ${result.category ? `<span class="category-tag">${result.category}</span>` : ''}
                        </div>
                        <div class="search-result-excerpt">
                            ${result.content ? result.content.substring(0, 150) + '...' : ''}
                        </div>
                    </div>
                `).join('');

                resultsContainer.innerHTML = resultsHTML;
            }

            searchResults.style.display = 'block';
            catalogSections.style.display = 'none';
            clearButton.style.display = 'inline-block';
        }

        function clearSearch() {
            searchInput.value = '';
            searchResults.style.display = 'none';
            catalogSections.style.display = 'block';
            clearButton.style.display = 'none';
        }

        // Event listeners
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });

        clearButton.addEventListener('click', clearSearch);

        // Real-time search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 1) {
                performSearch(query);
            } else if (query.length === 0) {
                clearSearch();
            }
        });
    }

    // Table of Contents functionality
    if (document.querySelector('.post-content')) {
        const tocToggle = document.getElementById('toc-toggle');
        const tocNav = document.getElementById('toc-nav');
        const tocList = document.getElementById('toc-list');
        const postContent = document.getElementById('post-content');
        
        // Generate TOC from headings
        function generateTOC() {
            const headings = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const tocItems = [];
            
            headings.forEach((heading, index) => {
                // Skip the main title (h1)
                if (heading.tagName === 'H1' && index === 0) return;
                
                // Create unique ID if not exists
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }
                
                const level = parseInt(heading.tagName.charAt(1));
                const text = heading.textContent.trim();
                
                tocItems.push({
                    id: heading.id,
                    text: text,
                    level: level
                });
            });
            
            // Generate TOC HTML
            if (tocItems.length > 0) {
                tocList.innerHTML = tocItems.map(item => `
                    <li class="toc-item">
                        <a href="#${item.id}" class="toc-link level-${item.level}" data-target="${item.id}">
                            ${item.text}
                        </a>
                    </li>
                `).join('');
                
                // Add click handlers for TOC links
                const tocLinks = tocList.querySelectorAll('.toc-link');
                tocLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('data-target');
                        const targetElement = document.getElementById(targetId);
                        
                        if (targetElement) {
                            // Remove active class from all links
                            tocLinks.forEach(l => l.classList.remove('active'));
                            // Add active class to clicked link
                            link.classList.add('active');
                            
                            // Smooth scroll to target
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                            
                            // Close TOC on mobile after clicking
                            if (window.innerWidth <= 768) {
                                closeTOC();
                            }
                        }
                    });
                });
                
                // Highlight current section on scroll
                const observerOptions = {
                    root: null,
                    rootMargin: '-20% 0px -70% 0px',
                    threshold: 0
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.id;
                            const activeLink = tocList.querySelector(`[data-target="${id}"]`);
                            
                            if (activeLink) {
                                tocLinks.forEach(l => l.classList.remove('active'));
                                activeLink.classList.add('active');
                            }
                        }
                    });
                }, observerOptions);
                
                headings.forEach(heading => {
                    if (heading.id) {
                        observer.observe(heading);
                    }
                });
                
                // Show TOC container
                document.querySelector('.toc-container').style.display = 'block';
            } else {
                // Hide TOC if no headings
                document.querySelector('.toc-container').style.display = 'none';
            }
        }
        
        // Toggle TOC visibility
        function toggleTOC() {
            tocNav.classList.toggle('open');
            tocToggle.classList.toggle('active');
        }
        
        function closeTOC() {
            tocNav.classList.remove('open');
            tocToggle.classList.remove('active');
        }
        
        // Event listeners
        if (tocToggle) {
            tocToggle.addEventListener('click', toggleTOC);
        }
        
        // Close TOC when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.toc-container')) {
                closeTOC();
            }
        });
        
        // Generate TOC when page loads
        generateTOC();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeTOC();
            }
        });
    }

    // Enhanced tag filtering functionality
    if (document.querySelector('.tags-cloud')) {
        const tagsCloud = document.querySelector('.tags-cloud');
        const tagLinks = tagsCloud.querySelectorAll('.tag-link');
        
        // Create enhanced tag filtering container
        const tagFilterContainer = document.createElement('div');
        tagFilterContainer.className = 'tag-filter-container';
        tagFilterContainer.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            display: none;
        `;
        
        const tagFilterTitle = document.createElement('h3');
        tagFilterTitle.className = 'tag-filter-title';
        tagFilterContainer.appendChild(tagFilterTitle);
        
        const tagFilterResults = document.createElement('div');
        tagFilterResults.className = 'tag-filter-results';
        tagFilterContainer.appendChild(tagFilterResults);
        
        const closeTagFilter = document.createElement('button');
        closeTagFilter.className = 'close-tag-filter';
        closeTagFilter.textContent = '关闭';
        closeTagFilter.style.cssText = `
            margin-top: 15px;
            padding: 10px 20px;
            background: #007acc;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.3s ease;
        `;
        tagFilterContainer.appendChild(closeTagFilter);
        
        // Insert after tags cloud
        tagsCloud.parentNode.insertBefore(tagFilterContainer, tagsCloud.nextSibling);
        
        // Enhanced post collection with tags and categories
        const allPosts = [];
        
        // Function to extract tags from post content
        function extractTagsFromContent(content) {
            const tagMatches = content.match(/tags:\s*\[([^\]]+)\]/i);
            if (tagMatches) {
                return tagMatches[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
            }
            return [];
        }
        
        // Function to collect posts with enhanced data
        function collectPostsWithEnhancedData() {
            // Get posts from categories
            document.querySelectorAll('.category-item').forEach(categoryItem => {
                const categoryName = categoryItem.getAttribute('data-category');
                const posts = categoryItem.querySelectorAll('.category-posts li');
                
                posts.forEach(post => {
                    const title = post.querySelector('a').textContent;
                    const url = post.querySelector('a').href;
                    const date = post.querySelector('time').textContent;
                    const postId = post.getAttribute('data-post-id');
                    
                    // Enhanced data collection
                    allPosts.push({
                        id: postId,
                        title: title,
                        url: url,
                        date: date,
                        category: categoryName,
                        tags: [categoryName.toLowerCase()], // Include category as tag
                        searchText: `${title} ${categoryName}`.toLowerCase()
                    });
                });
            });
            
            // Also collect from articles list if available
            document.querySelectorAll('.article-item').forEach(article => {
                const title = article.querySelector('h3 a').textContent;
                const url = article.querySelector('h3 a').href;
                const date = article.querySelector('time').textContent;
                const categoryTags = Array.from(article.querySelectorAll('.category-tag')).map(tag => tag.textContent);
                
                allPosts.push({
                    id: 'article-' + Math.random().toString(36).substr(2, 9),
                    title: title,
                    url: url,
                    date: date,
                    category: categoryTags[0] || '未分类',
                    tags: categoryTags,
                    searchText: `${title} ${categoryTags.join(' ')}`.toLowerCase()
                });
            });
        }
        
        collectPostsWithEnhancedData();
        
        // Enhanced filtering function
        function filterPostsByTag(tagName) {
            const searchTerm = tagName.toLowerCase();
            
            const filteredPosts = allPosts.filter(post => {
                // Check if tag matches category
                const categoryMatch = post.category.toLowerCase().includes(searchTerm);
                
                // Check if tag matches any tag in tags array
                const tagMatch = post.tags.some(tag => 
                    tag.toLowerCase().includes(searchTerm)
                );
                
                // Check if tag matches title
                const titleMatch = post.title.toLowerCase().includes(searchTerm);
                
                return categoryMatch || tagMatch || titleMatch;
            });
            
            // Remove duplicates based on URL
            const uniquePosts = filteredPosts.filter((post, index, self) => 
                index === self.findIndex(p => p.url === post.url)
            );
            
            displayTagResults(tagName, uniquePosts);
        }
        
        function displayTagResults(tagName, posts) {
            tagFilterTitle.textContent = `标签: ${tagName} (${posts.length}篇文章)`;
            
            if (posts.length === 0) {
                tagFilterResults.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <p>没有找到与"${tagName}"相关的文章</p>
                        <p style="font-size: 0.9rem; margin-top: 10px;">尝试其他标签或浏览所有文章</p>
                    </div>
                `;
            } else {
                const resultsHTML = posts.map(post => `
                    <div class="tag-result-item">
                        <h4>
                            <a href="${post.url}">${post.title}</a>
                        </h4>
                        <div class="tag-result-meta">
                            <time>${post.date}</time>
                            ${post.category ? `<span class="category-tag">分类: ${post.category}</span>` : ''}
                        </div>
                        <div class="tag-result-tags">
                            ${post.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                        </div>
                    </div>
                `).join('');
                
                tagFilterResults.innerHTML = resultsHTML;
            }
            
            tagFilterContainer.style.display = 'block';
            tagFilterContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Enhanced click handlers
        tagLinks.forEach(tagLink => {
            tagLink.addEventListener('click', function(e) {
                e.preventDefault();
                const tagName = this.textContent.replace(/\(\d+\)/, '').trim();
                filterPostsByTag(tagName);
            });
        });
        
        // Close tag filter
        closeTagFilter.addEventListener('click', function() {
            tagFilterContainer.style.display = 'none';
        });
        
        // Add tag badges styling
        const tagBadgesStyle = document.createElement('style');
        tagBadgesStyle.textContent = `
            .tag-result-tags {
                margin-top: 8px;
            }
            .tag-badge {
                display: inline-block;
                background: #e9ecef;
                color: #495057;
                padding: 2px 8px;
                margin: 2px;
                border-radius: 12px;
                font-size: 0.75rem;
            }
        `;
        document.head.appendChild(tagBadgesStyle);
    }

    // URL parameter handling for tag/category filtering
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Auto-filter tags/categories on catalog page
    if (window.location.pathname.includes('/catalog/index.html') || 
        window.location.pathname.includes('/catalog/') || 
        window.location.pathname.includes('/articles/')) {
        const filterParam = getUrlParameter('filter');
        if (filterParam) {
            // Wait for page to load
            setTimeout(() => {
                console.log('Filtering by:', filterParam);
                
                // Create enhanced filtering container if not exists
                if (!document.querySelector('.tag-filter-container')) {
                    const container = document.createElement('div');
                    container.className = 'tag-filter-container';
                    container.style.cssText = `
                        margin-top: 30px;
                        padding: 20px;
                        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    `;
                    
                    const title = document.createElement('h3');
                    title.className = 'tag-filter-title';
                    title.textContent = `标签: ${filterParam}`;
                    
                    const results = document.createElement('div');
                    results.className = 'tag-filter-results';
                    
                    container.appendChild(title);
                    container.appendChild(results);
                    
                    const content = document.querySelector('.catalog-content') || 
                                  document.querySelector('.page-content') ||
                                  document.querySelector('main');
                    
                    if (content) {
                        content.appendChild(container);
                    }
                }
                
                // Perform filtering
                if (window.filterPostsByTag) {
                    window.filterPostsByTag(filterParam);
                } else {
                    // Simple filtering fallback
                    const allPosts = [];
                    
                    // Collect posts from the page
                    document.querySelectorAll('.category-item').forEach(categoryItem => {
                        const categoryName = categoryItem.getAttribute('data-category');
                        const posts = categoryItem.querySelectorAll('.category-posts li');
                        
                        posts.forEach(post => {
                            const title = post.querySelector('a').textContent;
                            const url = post.querySelector('a').href;
                            const date = post.querySelector('time').textContent;
                            
                            allPosts.push({
                                title: title,
                                url: url,
                                date: date,
                                category: categoryName,
                                tags: [categoryName]
                            });
                        });
                    });
                    
                    const filteredPosts = allPosts.filter(post => {
                        return post.category.toLowerCase().includes(filterParam.toLowerCase()) ||
                               post.tags.some(tag => tag.toLowerCase().includes(filterParam.toLowerCase())) ||
                               post.title.toLowerCase().includes(filterParam.toLowerCase());
                    });
                    
                    const container = document.querySelector('.tag-filter-results');
                    if (container) {
                        if (filteredPosts.length === 0) {
                            container.innerHTML = `<p>没有找到与"${filterParam}"相关的文章</p>`;
                        } else {
                            container.innerHTML = filteredPosts.map(post => `
                                <div style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;">
                                    <h4><a href="${post.url}">${post.title}</a></h4>
                                    <div style="font-size: 0.9em; color: #666;">
                                        <time>${post.date}</time>
                                        <span style="margin-left: 10px;">分类: ${post.category}</span>
                                    </div>
                                </div>
                            `).join('');
                        }
                    }
                }
                
                // Scroll to results
                setTimeout(() => {
                    const container = document.querySelector('.tag-filter-container');
                    if (container) {
                        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 200);
            }, 300);
        }
    }

    // Enhanced tag filtering for catalog page
    if (document.querySelector('.tags-cloud') || document.querySelector('.categories-list')) {
        // Store original filtering function
        window.originalFilterPostsByTag = window.filterPostsByTag || function() {};
        
        // Enhanced filtering with URL support
        window.filterPostsByTag = function(tagName) {
            const searchTerm = tagName.toLowerCase();
            
            // Update URL without page reload
            const newUrl = window.location.pathname + '?filter=' + encodeURIComponent(tagName);
            window.history.replaceState({filter: tagName}, '', newUrl);
            
            // Perform filtering
            const filteredPosts = allPosts.filter(post => {
                const categoryMatch = post.category && post.category.toLowerCase().includes(searchTerm);
                const tagMatch = post.tags && post.tags.some(tag => 
                    tag.toLowerCase().includes(searchTerm)
                );
                const titleMatch = post.title.toLowerCase().includes(searchTerm);
                return categoryMatch || tagMatch || titleMatch;
            });
            
            const uniquePosts = filteredPosts.filter((post, index, self) => 
                index === self.findIndex(p => p.url === post.url)
            );
            
            // Display results
            if (window.displayTagResults) {
                window.displayTagResults(tagName, uniquePosts);
            }
            
            // Scroll to results
            setTimeout(() => {
                const resultsContainer = document.querySelector('.tag-filter-container') || 
                                       document.querySelector('.search-results');
                if (resultsContainer) {
                    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        };
    }

    // Updates page functionality
    if (document.querySelector('.page-updates')) {
        const updateSections = document.querySelectorAll('.page-updates h2');
        
        updateSections.forEach((section, index) => {
            const content = section.nextElementSibling;
            if (content && content.tagName === 'DIV') {
                // Add toggle button
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'update-toggle';
                toggleBtn.innerHTML = index === 0 ? '−' : '+';
                toggleBtn.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                    margin-right: 10px;
                    color: var(--ocean-medium);
                `;
                
                section.insertBefore(toggleBtn, section.firstChild);
                
                // Collapse all except first
                if (index > 0) {
                    content.style.display = 'none';
                }
                
                // Add click handler
                toggleBtn.addEventListener('click', function() {
                    const isHidden = content.style.display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';
                    this.innerHTML = isHidden ? '−' : '+';
                });
            }
        });
    }

    console.log('Moonshot Test Theme loaded successfully!');
});
