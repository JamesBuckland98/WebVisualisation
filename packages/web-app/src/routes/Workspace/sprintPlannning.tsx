import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { IssueCard } from 'components/Cards/issue';
import { SprintCard } from 'components/Cards/sprint';
import { IssueFilter } from 'components/Filter/issues';
import { SprintFilter } from 'components/Filter/sprints';
import { sprints } from 'data';
import { SprintStatus } from 'models/Sprint';
import { Issue } from 'models/Issue';
import { fetchWorkspaceIssues } from 'services/api/issues';

const SprintPlanning: FunctionalComponent = () => {
    const [isSprintView, setIsSprintView] = useState<boolean>(false);
    const [issueFilter, setIssueFilter] = useState<string>('');
    const [sprintFilter, setSprintFilter] = useState<string>('open');

    const [issuesArray, setIssuesArray] = useState<Issue[]>([]);

    const updateIssueFilter = (filterFor: string): void => console.log(filterFor);
    const updateSprintFilter = (filterFor: string): void => setSprintFilter(filterFor);

    useEffect(() => {
        fetchWorkspaceIssues(1).then((issuePagination) => {
            setIssuesArray(issuePagination.issues);
            console.log(issuePagination.pageData);
        });
    }, []);

    // TODO Need to figure out how we actually want to sort issues, because current setup doesn't make much sense
    const issuesList = issuesArray.map((issue, index) => {
        return <IssueCard key={index} issue={issue} />;
    });

    const sprintsList = sprints.map((sprint, index) => {
        if (sprintFilter === 'all' || sprint.status.toString() === sprintFilter) {
            return (
                <SprintCard
                    key={index}
                    id={sprint.id}
                    projectId={sprint.projectId}
                    title={sprint.title}
                    description={sprint.description}
                    closed={sprint.status === SprintStatus.closed}
                />
            );
        }
    });

    return (
        <Fragment>
            <div class="flex">
                <div class={`h-full w-11/12 md:w-1/2 md:block " ${!isSprintView ? '' : 'sm:hidden'}`}>
                    <div class="create-bar">
                        <h1 class="page-heading items-baseline">Backlog</h1>
                        <button
                            onClick={(): void => setIsSprintView(!isSprintView)}
                            class="btn-create md:hidden my-auto mr-4"
                        >
                            Sprints
                        </button>
                    </div>
                    <div class="mr-4">
                        <IssueFilter setFilter={updateIssueFilter} />
                    </div>
                    <div class="mr-4 rounded bg-white shadow-lg">{issuesList}</div>
                </div>
                <div
                    class={`md:border-l border-gray-300 h-full w-11/12 md:w-1/2 md:block " ${
                        isSprintView ? '' : 'sm:hidden'
                    }`}
                >
                    <div class="create-bar">
                        <h1 class="md:ml-4 page-heading">Sprints</h1>
                        <button
                            onClick={(): void => setIsSprintView(!isSprintView)}
                            class="btn-create md:hidden my-auto mr-4"
                        >
                            Backlog
                        </button>
                    </div>
                    <div class="md:ml-4">
                        <SprintFilter setFilter={updateSprintFilter} />
                    </div>
                    <div class="md:ml-4 rounded bg-white overflow-hidden shadow-lg">{sprintsList}</div>
                </div>
            </div>
        </Fragment>
    );
};

export default SprintPlanning;
