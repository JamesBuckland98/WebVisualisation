import { FunctionalComponent, h } from 'preact';

import Sidebar from 'components/Navigation/Sidebar';
import { sideNavItems } from 'routes/Workspaces/util';
import IssueFilter from 'components/Filter/issues';
import IssueListItem from 'components/ListItems/issue';
import { Issue } from 'models/Issue';
import { SprintListItem } from 'components/ListItems/sprint';
import { Sprint } from 'models/Sprint';
import SprintFilter from 'components/Filter/sprints';

const WorkspacesIssues: FunctionalComponent = () => {
    const issues: Issue[] = [
        {
            id: 1,
            name: 'As a user, I want to be edit a workspace so they can be altered after creation',
            description: 'An insightful description of a user story',
            storyPoint: 1,
            project: 'Phoenix Project',
        },
        {
            id: 2,
            name: 'As a scrum master, I want to view a burn down chart for a sprint so that I can view velocity',
            description: 'An insightful description of a user story',
            storyPoint: 3,
            project: 'Phoenix Project',
        },
        {
            id: 1,
            name: 'As a scrum master, I want to view the current number of closed tasks for a sprint',
            description: 'An insightful description of a user story',
            storyPoint: 1,
            project: 'Phoenix Project',
        },
    ];

    const sprints: Sprint[] = [
        {
            id: 1,
            name: 'Skyfall',
            description: 'Insert insightful and creative description of a sprint here',
        },
        {
            id: 2,
            name: 'Quantum of Solace',
            description: 'Insert insightful and creative description of a sprint here',
        },
        {
            id: 1,
            name: 'Spectre',
            description: 'Insert insightful and creative description of a sprint here',
        },
    ];

    return (
        <div class="page">
            <div class="flex">
                <Sidebar items={sideNavItems} />
                <div className="main-content">
                    <h1 className="user-path">CUBRIC > Backlog</h1>
                    <div class="flex h-screen">
                        <div class="w-11/12 md:w-1/2">
                            <div className="create-bar">
                                <h1 className="page-heading">Issues</h1>
                            </div>
                            <div class="mr-4">
                                <IssueFilter />
                            </div>
                            <div className="mr-4 rounded bg-white shadow-lg">
                                {issues.map((issue, index) => {
                                    return (
                                        <IssueListItem
                                            key={index}
                                            id={issue.id}
                                            name={issue.name}
                                            description={issue.description}
                                            storyPoint={issue.storyPoint}
                                            project={issue.project}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div class="border-l border-gray-300 h-full w-1/2 hidden md:block">
                            <div className="create-bar">
                                <h1 className="ml-4 page-heading">Sprints</h1>
                            </div>
                            <div class="ml-4">
                                <SprintFilter />
                            </div>
                            <div className="ml-4 rounded bg-white overflow-hidden shadow-lg">
                                {sprints.map((issue, index) => {
                                    return (
                                        <SprintListItem
                                            key={index}
                                            id={issue.id}
                                            name={issue.name}
                                            description={issue.description}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkspacesIssues;
