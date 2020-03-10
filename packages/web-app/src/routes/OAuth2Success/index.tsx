import { Fragment, FunctionalComponent, h } from 'preact';
import { getCurrentUrl, route } from 'preact-router';
import { useContext, useState } from 'preact/hooks';

import { AuthStoreContext } from 'stores';
import { Error } from 'components/Error';

const OAuth2Success: FunctionalComponent = () => {
    const authStore = useContext(AuthStoreContext);
    const [isError, setIsError] = useState(false);

    const authenticate = (): void => {
        const url = getCurrentUrl();
        const token = url.match(/token=(.*)/)[0].substring(6);

        authStore.login(token).then((success) => {
            if (success) {
                route('/');
            } else {
                setIsError(true);
            }
        });
    };

    return (
        <Fragment>
            {authenticate()}
            <div className="main-content overflow-hidden">
                <div className={`loader mx-auto mt-20 ${isError ? 'hidden' : 'block'}`} />
                <div className={`mt-20 sm:w-4/5 lg:w-3/5 ${isError ? 'block' : 'hidden'}`}>
                    <Error message={'An error occurred.'} />
                </div>
            </div>
        </Fragment>
    );
};

export default OAuth2Success;
