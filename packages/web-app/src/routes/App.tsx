import { FunctionalComponent, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { getCurrentUrl, route, Router, RouterOnChangeArgs } from 'preact-router';

import TopBar from 'components/Navigation/TopBar';
import Home from 'routes/Home';
import SprintView from 'routes/Sprints';
import Metrics from 'routes/Sprints/Metrics';
import { AuthStoreContext } from 'stores';

// @Lauren Lazy loading would probably be beneficial I think? Especially if more pages are later added
// @Lauren Ok Lazy loading has issues, and I'm a bit too tipsy to fix them rn, but probably a decent idea for future me to work out the kinks on
const Login = lazy(() => import('routes/Login'));

const WorkspacesEdit = lazy(() => import('routes/Workspaces/edit'));
const WorkspacesIssues = lazy(() => import('routes/Workspaces/issues'));
const WorkspacesMetrics = lazy(() => import('routes/Workspaces/metrics'));
const WorkspacesSprints = lazy(() => import('routes/Workspaces/sprints'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require('preact/debug');
}

const App: FunctionalComponent = () => {
    const authStore = useContext(AuthStoreContext);

    const [currentUrl, setCurrentUrl] = useState<string>(getCurrentUrl());

    const publicRoutes = ['/login'];

    const authGuard = (): void => {
        if (!publicRoutes.includes(currentUrl) && !authStore.isAuthenticated) {
            // TODO: Half broken until https://github.com/preactjs/preact-router/issues/357 is resolved
            route('/login');
        }
    };

    return (
        <div id="app" class="bg-blue-100">
            <Suspense fallback={<div>Loading...</div>}>
                {/*{authGuard()}*/}
                <TopBar />
                <Router onChange={(e: RouterOnChangeArgs): void => setCurrentUrl(e.url)}>
                    <Home path="/" />
                    <Login path="/login" />
                    <WorkspacesSprints path="/workspace/:id" />
                    <WorkspacesIssues path="/workspace/:id/issues" />
                    <WorkspacesMetrics path="/workspace/:id/metrics" />
                    <WorkspacesEdit path="/workspace/:id/edit" />
                    <Metrics path="/sprint/:id/metrics" />
                    <SprintView path="/sprint/:id" />
                    <SprintView path="/sprint/:id/metrics" />
                    <SprintView path="/sprint/:id/board" />
                    <SprintView path="/sprint/:id/show-tell" />
                </Router>
            </Suspense>
        </div>
    );
};

export default App;
