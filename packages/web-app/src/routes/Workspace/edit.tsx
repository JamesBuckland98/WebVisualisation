import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { GenericEdit } from 'components/CommonRoutes/Edit';
import { editWorkspace } from 'services/api/workspaces';
import { useStore } from 'stores';

const WorkspaceEdit: FunctionalComponent = () => {
    const currentWorkspace = useStore().userLocationStore.currentWorkspace;

    const [name, setName] = useState(currentWorkspace.name);
    const [description, setDescription] = useState(currentWorkspace.description);
    const [projectsInWorkspace, setProjectsInWorkspace] = useState<string[]>([]); // TODO: Figure this out

    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (): void => {
        editWorkspace(currentWorkspace.id, {
            id: currentWorkspace.id,
            name,
            description,
        }).then((error) => {
            if (error) setErrorMessage(error);
            else console.log('Success');
        });
    };

    return (
        <GenericEdit
            editForm={
                <Fragment>
                    <div class="m-4">
                        <label class="form-label">Workspace Name</label>
                        <input
                            class="form-input"
                            type="text"
                            placeholder="Workspace Name"
                            value={name}
                            onInput={(e): void => setName((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div class="m-4">
                        <label class="form-label">Workspace Description</label>
                        <input
                            class="form-input"
                            type="text"
                            placeholder="Workspace Description"
                            value={description}
                            onInput={(e): void => setDescription((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div class="m-4">
                        <label class="form-label">Projects in this Workspace</label>
                        <textarea
                            class="form-input"
                            rows={5}
                            type="text"
                            placeholder="Phoenix, Narwhal, Unicorn"
                            value={projectsInWorkspace}
                            // TODO this will need to be an array of projects, maybe through a drop down? Definitely not a cowboy'd string array.
                            // onInput={(e): void => setWorkspaceName((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div class="error">{errorMessage}</div>
                </Fragment>
            }
        />
    );
};

export default WorkspaceEdit;
