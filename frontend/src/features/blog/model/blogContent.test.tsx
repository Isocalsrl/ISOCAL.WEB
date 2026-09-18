import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlogContent } from "../components/BlogContent";

describe("contenido editorial", () => {
    it("renderiza Markdown e imágenes sin ejecutar HTML ni enlaces de script", () => {
        const html = renderToStaticMarkup(
            <BlogContent
                content={
                    '## Presión\n\n**Importante**\n\n<script>alert(1)</script>\n\n[Enlace](javascript:alert(1))\n\n![Imagen](https://example.com/equipo.png)'
                }
            />,
        );

        expect(html).toContain("<h2>Presión</h2>");
        expect(html).toContain("<strong>Importante</strong>");
        expect(html).not.toContain("<script>");
        expect(html).not.toContain('href="javascript:');
        expect(html).toContain('class="blog-content-image"');
        expect(html).toContain('src="https://example.com/equipo.png"');
        expect(html).toContain('alt="Imagen"');
    });
});
