import { Request, Response } from "express";

const docs = (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PGBee API Documentation</title>
      <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
    </head>
    <body>
      <rapi-doc 
        spec-url="/api-spec" 
        theme="dark"
        bg-color="#1e1e1e"
        text-color="#ffffff"
        primary-color="#4CAF50"
        nav-bg-color="#2d2d2d"
        nav-text-color="#ffffff"
        nav-hover-bg-color="#404040"
        nav-hover-text-color="#ffffff"
        render-style="read"
        schema-style="table"
        default-schema-tab="schema"
        show-header="true"
        allow-authentication="true"
        allow-try="true"
        allow-server-selection="true"
        show-info="true"
        info-description-headings-in-navbar="true"
        use-path-in-nav-bar="true"
      >
      </rapi-doc>
    </body>
    </html>
  `;
  res.send(html);
};
export default docs;
