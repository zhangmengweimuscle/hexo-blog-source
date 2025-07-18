# GitHub Style Theme for Hexo

A clean, responsive GitHub-style theme for Hexo with a modern design and excellent readability.

## Features

- 🎨 **GitHub-inspired Design** - Clean and professional look
- 📱 **Responsive Layout** - Works perfectly on all devices
- 🎯 **Left Sidebar** - Fixed sidebar with author info and navigation
- 📝 **Markdown Support** - Beautiful rendering for all markdown elements
- 🔍 **Search Integration** - Built-in search functionality
- 🌐 **Multi-language Support** - English and Chinese included
- ⚡ **Fast Loading** - Optimized CSS and JavaScript
- 🌈 **Syntax Highlighting** - Code blocks with GitHub-style highlighting

## Installation

1. Clone this theme to your Hexo site's `themes` directory:
   ```bash
   git clone https://github.com/yourusername/hexo-theme-github-style.git themes/github-style
   ```

2. Modify your site's `_config.yml`:
   ```yaml
   theme: github-style
   ```

3. Install required dependencies:
   ```bash
   npm install hexo-renderer-ejs hexo-renderer-stylus --save
   ```

## Configuration

### Site Configuration

Update your site's `_config.yml`:

```yaml
# Site
title: Your Blog Title
subtitle: Your Blog Subtitle
description: Your blog description
keywords: blog, hexo, github
author: Your Name
language: en
timezone: ''
```

### Theme Configuration

Update `themes/github-style/_config.yml`:

```yaml
# Header
menu:
  Home: /
  Archives: /archives
  Categories: /categories
  Tags: /tags
  About: /about

# Social Links
social:
  GitHub: https://github.com/yourusername
  Twitter: https://twitter.com/yourusername
  Email: mailto:your@email.com

# Site Settings
favicon: /favicon.ico
avatar: /images/avatar.png

# Footer
since: 2024

# Analytics
google_analytics: UA-XXXXXXXXX-X
```

## Customization

### Adding Your Avatar

Place your avatar image in the `source/images/` directory and update the `avatar` setting in the theme configuration.

### Custom Colors

You can customize the color scheme by modifying the CSS variables in `source/css/style.css`.

### Adding New Social Links

Add new social links in the theme configuration:

```yaml
social:
  GitHub: https://github.com/yourusername
  Twitter: https://twitter.com/yourusername
  LinkedIn: https://linkedin.com/in/yourusername
```

## Layout Structure

```
github-style/
├── _config.yml          # Theme configuration
├── layout/              # Layout templates
│   ├── _partial/        # Partial templates
│   │   ├── head.ejs     # Head section
│   │   ├── header.ejs   # Header section
│   │   ├── sidebar.ejs  # Sidebar section
│   │   ├── footer.ejs   # Footer section
│   │   └── ...
│   ├── index.ejs        # Homepage layout
│   ├── post.ejs         # Post layout
│   └── page.ejs         # Page layout
├── source/              # Static assets
│   ├── css/             # Stylesheets
│   └── js/              # JavaScript files
└── languages/           # Language files
    ├── en.yml           # English
    └── zh-CN.yml        # Chinese
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you have any questions or issues, please feel free to open an issue on GitHub.
