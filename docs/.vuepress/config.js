module.exports = {
    head: [
        ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `/images/favicon.ico` }]
    ],
    //Page top title
    title: "Fred's blog",
    //Page description
    description: "Welcome to my blog",
    //Setting base, ropository name in github
    base: '/blog/',
    //Enable line number on each code block
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        //Showing last updated time of each document 
        lastUpdated: 'Last Updated',
        //Top navbar
        nav: [
            { text: 'CV', link: '/CV/' },
            {
                text: 'Notes',
                link: '/notes/',
                items: [{
                        text: 'Frontend',
                        link: '/notes/frontend/',
                        items: [
                            { text: 'HTML5', link: '/notes/frontend/HTML5' },
                            { text: 'CSS3', link: '/notes/frontend/CSS3' },
                            { text: 'JavaScript', link: '/notes/frontend/JavaScript' },
                        ]
                    },
                    {
                        text: 'Backend',
                        link: '/notes/backend/',
                        items: [
                            { text: '.NET', link: '/notes/backend/.NET' },
                            { text: 'Node.js', link: '/notes/backend/Node.js' },
                        ]
                    }
                ]
            },
            { text: 'Articals', link: '/articals/' },
            { text: 'Github', link: 'https://github.com/Fred-Fengwei-Yuan' },
        ],
        //Auto sidebar for single pages
        sidebar: 'auto',
    },
}