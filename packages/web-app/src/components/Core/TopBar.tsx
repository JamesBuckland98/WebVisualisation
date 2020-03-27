import { FunctionalComponent, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { Link, route } from 'preact-router';
import { Menu, X } from 'preact-feather';
import { notify } from 'react-notify-toast';

import scrumCards from 'assets/icons/scrumCards.png';
import avatar from 'assets/gitlab_avatar.png';
import { errorColour } from 'services/Notification/colours';
import { AuthStoreContext } from 'stores';

export const TopBar: FunctionalComponent = () => {
    const authStore = useContext(AuthStoreContext);

    const [showAccountDropdown, setShowAccountDropdown] = useState(false);

    const logout = async (): Promise<void> => {
        const error = await authStore.logout();

        if (error) notify.show(error, 'error', 5000, errorColour);
        else route('/login', true);
    };

    return (
        <header>
            <div class="header min-h-16">
                <div class="flex items-center justify-between px-4 py-3 sm:p-0">
                    <Link href="/" class="flex items-center flex-shrink-0 text-deep-space-sparkle mr-6">
                        <img class="h-8" src={scrumCards} alt="Image of Scrum Cards" />
                        <span class="ml-1 font-semibold text-xl tracking-wide">Scrumble</span>
                    </Link>
                    <div class="sm:hidden">
                        <button
                            onClick={(): void => setShowAccountDropdown(!showAccountDropdown)}
                            onBlur={(): void => setShowAccountDropdown(false)}
                            type="button"
                            class="block text-deep-space-sparkle hover:text-gray-400 focus:outline-none"
                        >
                            <div class="flex items-start items-baseline min-h-12">
                                <div class={`my-auto ml-2 ${!showAccountDropdown ? 'block' : 'hidden'}`}>
                                    <Menu size={20} />
                                </div>
                                <div class={`my-auto ml-2 ${showAccountDropdown ? 'block' : 'hidden'}`}>
                                    <X size={20} />
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <nav class={`sm:block ${showAccountDropdown ? '' : 'hidden'}`}>
                    <div class="sm:flex sm:p-0">
                        <div class="hidden sm:block sm:ml-6">
                            <div class="relative">
                                <button
                                    onClick={(): void => setShowAccountDropdown(!showAccountDropdown)}
                                    onBlur={(): void => setShowAccountDropdown(false)}
                                    class={`btn-account-dropdown ${
                                        showAccountDropdown ? 'outline-none border-white' : ''
                                    }`}
                                >
                                    <img class="avatar" src={avatar} alt="Your avatar" />
                                </button>
                                <div
                                    class={`btn-sign-out shadow-lg is-clickable ${
                                        showAccountDropdown ? 'block' : 'hidden'
                                    }`}
                                    onMouseDown={logout}
                                >
                                    <span class="block px-4 py-2 text-white text-center">Sign Out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <div
                class={`sm:hidden z-20 fixed w-full mt-16 bg-gray-200 border-b border-gray-500 ${
                    showAccountDropdown ? 'block' : 'hidden'
                }`}
            >
                <div class="flex items-center border-b border-gray-300 py-2">
                    <img class="ml-3 avatar" src={avatar} alt="Your avatar" />
                    <span class="ml-3 font-semibold text-deep-space-sparkle">Greg</span>
                </div>
                <div class="my-4 ml-3 is-clickable" onClick={logout}>
                    <span class="top-nav-dropdown-link">Sign out</span>
                </div>
            </div>
        </header>
    );
};
