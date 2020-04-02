import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { notify } from 'react-notify-toast';

import { CreateOrEditIssue } from 'components/CreateOrEditIssue';
import { Modal } from 'components/Modal';
import { Issue, IssueStatus } from 'models/Issue';
import { editIssue } from 'services/api/issues';
import { observer } from 'services/mobx';
import { errorColour } from 'services/Notification/colours';
import { useStore } from 'stores';
import { IssueInformation } from 'components/IssueInformation'

export const IssueBoardCard: FunctionalComponent<Issue> = (props: Issue) => {
    return (
        <div class="bg-white relative rounded-md shadow-lg m-2 min-h-48 m-4">
            <div class="px-4 py-2 h-40">
                <p class="">{props.title}</p>
            </div>
            <div class="absolute bottom-0 left-0 px-4 py-2">
                <div class="flex">
                    <span class="story-pnt">{props.storyPoint}</span>
                    <p class="font-hairline text-gray-700">{props.projectId}</p>
                </div>
            </div>
        </div>
    );
};

interface IProps {
    issue: Issue;
    refresh: () => void;
    updateIssue: () => void;
}

export const IssueCard: FunctionalComponent<IProps> = observer((props: IProps) => {
    const userLocationStore = useStore().userLocationStore;

    const [showEditIssueModal, setShowEditIssueModal] = useState(false);
    const [showIssueCardInformation, setShowIssueCardInformation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleIssueEdit = async (issue: Issue): Promise<void> => {
        return await editIssue(
            userLocationStore.currentWorkspace.id,
            props.issue.projectId,
            props.issue.iid,
            issue,
        ).then((error) => {
            if (error) notify.show(error, 'error', 5000, errorColour);
            else {
                setShowEditIssueModal(false);
                props.updateIssue();
            }
        });
    };

    return (
        <div class="cursor-default capitalize">
             {showEditIssueModal ? (
                    <Modal
                        title="Edit Issue"
                        content={
                            <CreateOrEditIssue
                                issue={props.issue}
                                submit={handleIssueEdit}
                                close={(): void => setShowEditIssueModal(false)}
                            />
                        }
                        close={(): void => setShowEditIssueModal(false)}
                    />
                ) : null}
                {showIssueCardInformation ? (
                    <Modal
                        title={props.issue.title}
                        content={
                            <IssueInformation
                                issue = {props.issue}
                            />
                        }
                        close={(): void => setShowIssueCardInformation(false)}
                    />
                ): null}
            <div class="lst-itm-container cursor-move">
                <div class="px-4 py-2 flex min-w-0">
                    <div 
                        class="truncate cursor-pointer underline font-semibold hover:text-blue-500"
                        onClick={(): void => {
                            setShowIssueCardInformation(true);
                            setErrorMessage('');
                        }}
                    >
                        {props.issue.title}
                    </div>
                    
                </div>
                <div class="px-4 py-2 z-1">
                    <span class={props.issue.status === IssueStatus.open ? "open" : "closed" }>{props.issue.status}</span>
                    {props.issue.storyPoint !== 0 && <span class="story-pnt">{props.issue.storyPoint}</span>}
                    <span class="text-gray-700"> Project Name: {props.issue.projectName}</span>
                    <div>
                        <button
                            class="float-right btn-edit my-auto"
                            onClick={(): void => {
                                setShowEditIssueModal(true);
                                setErrorMessage('');
                            }}
                        >
                            Edit
                        </button>
                        <span class="float-right text-gray-700 py-2 px-4"> <span class="font-medium">Author:</span> {props.issue.author}</span>
                        <span class="float-left text-gray-700 py-2"> <span class="font-medium">Assignee:</span> {props.issue.assignee}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});
