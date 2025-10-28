export const courses = [
  {
    _id: "html",
    title: "HTML for Beginners",
    description: "Learn the structure of web pages using HTML tags, forms, tables, and semantic elements.",
    image: "/images/html.png", // Using local image path
    videoUrl: "https://www.youtube.com/embed/_GTMOmRrqkU",
    author: { name: "LERN Team" },
    quiz: [
      {
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language", "HyperText Markdown Language"],
        answer: 0,
        explanation: "HTML stands for HyperText Markup Language, used to structure web content."
      },
      {
        question: "Which tag is used to create a hyperlink?",
        options: ["&lt;link&gt;", "&lt;a&gt;", "&lt;href&gt;", "&lt;url&gt;"],
        answer: 1,
        explanation: "&lt;a&gt; is used to create hyperlinks in HTML."
      }
    ]
  },
  {
    _id: "css",
    title: "CSS Fundamentals",
    description: "Style your web pages with colors, layouts, flexbox, grid, and responsive design.",
    image: "/images/css.png", // Using local image path
    videoUrl: "https://www.youtube.com/embed/G3e-cpL7ofc",
    author: { name: "LERN Team" },
    quiz: [
      {
        question: "Which property is used to change text color in CSS?",
        options: ["font-color", "text-color", "color", "background-color"],
        answer: 2,
        explanation: "The 'color' property sets the text color."
      },
      {
        question: "Which CSS layout uses rows and columns?",
        options: ["Flexbox", "Grid", "Inline-block", "Float"],
        answer: 1,
        explanation: "CSS Grid is designed for two-dimensional layouts."
      }
    ]
  },
  {
    _id: "js",
    title: "JavaScript Essentials",
    description: "Add interactivity with variables, functions, DOM manipulation, and event handling.",
    image: "/images/js.png", // Using local image path
    videoUrl: "https://www.youtube.com/embed/kAiX0itnonM",
    author: { name: "LERN Team" },
    quiz: [
      {
        question: "Which keyword declares a variable in JavaScript?",
        options: ["var", "int", "string", "define"],
        answer: 0,
        explanation: "'var' is one of the keywords used to declare variables."
      },
      {
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Method", "Display Output Module", "Document Output Method"],
        answer: 0,
        explanation: "DOM stands for Document Object Model, which represents the structure of a webpage."
      }
    ]
  }
];