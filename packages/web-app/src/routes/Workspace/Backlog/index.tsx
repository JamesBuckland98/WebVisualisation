import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { notify } from 'react-notify-toast';
import { IssueCard } from 'components/Cards/issue';
import { CreateOrEditIssue } from 'components/CreateOrEdit/issue';
import { filterStatusEnum, IssueFilter } from 'components/Filter/issue';
import { Modal } from 'components/Modal';
import { DateTime } from 'luxon';
import { Issue, IssueStatus } from 'models/Issue';
import { createIssue, getIssues } from 'services/api/issues';
import { errorColour, successColour } from 'services/notification/colours';
import { useStore } from 'stores';

const Backlog: FunctionalComponent = () => {
    const userLocationStore = useStore().userLocationStore;

    const [showNewIssueModal, setShowNewIssueModal] = useState(false);

    const [issueFilter, setIssueFilter] = useState(IssueStatus.open.toString());
    const [issueFilterTerm, setIssueFilterTerm] = useState('');

    const [issuesArray, setIssuesArray] = useState<Issue[]>([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    const [currentProjectId, setCurrentProjectId] = useState(0);

    const handleIssueCreation = async (newIssue: Issue, projectId: number): Promise<void> => {
        return await createIssue(userLocationStore.currentWorkspace.id, projectId, newIssue).then((result: Issue) => {
            if (typeof result == 'string') notify.show(result, 'error', 5000, errorColour);
            notify.show('New issue created!', 'success', 5000, successColour);
            fetchIssues();
            setShowNewIssueModal(false);
        });
    };
    const updateIssueFilter = (filterFor: string): void => {
        setCurrentPageNumber(0);
        setCurrentProjectId(0);
        setIssuesArray([]);
        if (Object.values(filterStatusEnum).includes(filterFor)) setIssueFilter(filterFor);
        else setIssueFilterTerm(filterFor);
    };

    const fetchIssues = (): void => {
        getIssues(
            userLocationStore.currentWorkspace.id,
            currentProjectId,
            currentPageNumber,
            issueFilter,
            issueFilterTerm,
        ).then((result) => {
            if (typeof result == 'string') notify.show(result, 'error', 5000, errorColour);
            else if (result.nextResource.pageNumber !== 0) {
                setIssuesArray((oldValues) => oldValues.concat(result.issues));
                setCurrentPageNumber(result.nextResource.pageNumber);
                setCurrentProjectId(result.nextResource.projectId);
            }
            else if (result.nextResource.pageNumber === 0) {
                setIssuesArray(result.issues);
            }
        });
    };
    const updateIssue = (updatedIssue: Issue): void => {
        let arrayCopy = [...issuesArray];
            issuesArray.forEach((issue: Issue, index) => {
                if(issue.iid === updatedIssue.iid) {
                    updatedIssue.createdAt = DateTime.local().toLocaleString();
                    arrayCopy[index] = updatedIssue;
                    setIssuesArray(arrayCopy);
                }
            });
            
    };

    useEffect(() => {
        fetchIssues();
        // TODO This is a completely legitimate warning, but I don't know how to fix it correctly. Help?
    }, [issueFilter, issueFilterTerm]);

    const scrollCheck = (e: HTMLDivElement): void => {
        const bottom = e.scrollHeight - e.scrollTop === e.clientHeight;
        if (bottom) fetchIssues();
    };

    return (
        <div class={showNewIssueModal ? 'modal-active' : ''}>
            {showNewIssueModal ? (
                <Modal
                    title="Create Issue"
                    content={
                        <CreateOrEditIssue
                            submit={handleIssueCreation}
                            close={(): void => setShowNewIssueModal(false)}
                        />
                    }
                    close={(): void => setShowNewIssueModal(false)}
                />
            ) : null}

            <div class="create-bar">
                <h1 class="page-heading">Backlog Planning</h1>
                <button class="btn-create my-auto" onClick={(): void => setShowNewIssueModal(true)}>
                    New Issue
                </button>
            </div>
            <div>
                <IssueFilter setFilter={updateIssueFilter} />
            </div>
            <div
                class="rounded bg-white overflow-hidden shadow-lg overflow-y-scroll issuesList"
                onScroll={(e): void => scrollCheck(e.target as HTMLDivElement)}
            >
                {issuesArray.map((issue, index) => {
                    // if (issueFilter === 'all' || issue.state.toString() === issueFilter) {
                    return <IssueCard key={index} issue={issue} refresh={fetchIssues} updateIssue={updateIssue} />;
                    // }
                })}
            </div>
        </div>
    );
};

export default Backlog;
