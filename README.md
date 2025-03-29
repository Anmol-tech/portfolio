# Personal Portfolio Website

A modern, responsive portfolio website showcasing my work as a Full Stack Developer with AI expertise. Built with HTML, CSS, and JavaScript.

## Features

- 🎨 Dark/Light theme support
- 📱 Fully responsive design
- ⚡ Static site (no build process required)
- 📨 Contact form integration with Formspree
- 🎯 Smooth scroll navigation
- 🖼️ Project showcase with live demos
- 💼 Detailed work experience timeline
- 🎓 Education history with institution logos
- 🛠️ Comprehensive skills section

## Setup

1. Clone the repository:

```bash
git clone https://github.com/Anmol-tech/portfolio.git
cd portfolio
```

2. Update the Formspree endpoint in `index.html`:

```html
<form
	class="contact-form"
	action="https://formspree.io/f/your-formspree-id"
	method="POST"
></form>
```

3. Replace images:

- Add your university logos in `/images/`
- Update image paths in `index.html`

4. Customize content:

- Update personal information in `index.html`
- Modify theme colors in `:root` CSS variables
- Add/remove sections as needed

## Structure

```
/portfolio
├── index.html          # Main portfolio page
├── thanks.html         # Form submission success page
├── images/
│   ├── scu-logo.png    # University logos
│   └── ggsipu-logo.png
└── README.md           # Project documentation
```

## Deployment

This is a static website that can be hosted on:

- GitHub Pages
- Netlify
- Vercel
- Any static file hosting service

## License

MIT License - feel free to use this template for your own portfolio!

## Credits

- Icons: [Font Awesome](https://fontawesome.com/)
- Font: Fira Code
- Form Backend: [Formspree](https://formspree.io/)
