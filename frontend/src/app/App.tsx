import {
    AuthProvider,
} from "../features/auth/context/AuthProvider";

import {
    AppRouter,
} from "./router/AppRouter";

export default function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}
