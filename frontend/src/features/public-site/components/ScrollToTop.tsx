import {
    useEffect,
} from "react";

import {
    useLocation,
} from "react-router-dom";

export function ScrollToTop() {
    const {
        pathname,
        hash,
    } = useLocation();

    useEffect(() => {
        const animationFrame =
            window.requestAnimationFrame(
                () => {
                    if (hash) {
                        const target =
                            document.getElementById(
                                decodeURIComponent(
                                    hash.slice(1),
                                ),
                            );

                        if (target) {
                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });

                            return;
                        }
                    }

                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "auto",
                    });
                },
            );

        return () => {
            window.cancelAnimationFrame(
                animationFrame,
            );
        };
    }, [
        pathname,
        hash,
    ]);

    return null;
}