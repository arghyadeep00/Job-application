import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



const loadTemplate = (templateName, replacements) => {
    const filePath = path.join(__dirname, `../templates/${templateName}.html`);
    let html = fs.readFileSync(filePath, "utf8");

    for (const key in replacements) {
        html = html.replace(
            new RegExp(`{{${key}}}`, "g"),
            replacements[key]
        );
    }

    return html;
};

export default loadTemplate;
