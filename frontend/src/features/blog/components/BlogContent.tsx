import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function BlogContent({content}: { content: string }) {
    return <div className="blog-content"><Markdown remarkPlugins={[remarkGfm]} skipHtml
        disallowedElements={['iframe', 'script', 'style', 'input']}
        components={{
            h1: ({children}) => <h2>{children}</h2>,
            img: ({src, alt}) => <img className="blog-content-image" src={src} alt={alt ?? ""} loading="lazy" />,
        }}>
        {content}
    </Markdown></div>;
}
