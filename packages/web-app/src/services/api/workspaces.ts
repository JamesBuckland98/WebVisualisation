import { apiService } from 'ts-api-toolkit';

import { Workspace } from 'models/Workspace';

// Implementation will be Scrumble-Only, GitLab has no concept of Workspaces
export const editWorkspace = async (workspaceId: number, updatedWorkspace: Workspace): Promise<void | string> => {
    return await apiService
        .put(`/workspace/${workspaceId}`, updatedWorkspace)
        .then(() => {
            return;
        })
        .catch(({ response }) => {
            return response.data?.message || 'Unknown error while updating workspace details';
        });
};

export const createWorkspace = async (name: string, description: string): Promise<Workspace | string> => {
    return await apiService
        .post('/workspaces/create', { name, description })
        .then((res) => {
            return res.data;
        })
        .catch(({ response }) => {
            return response.data?.message || 'Unknown error while updating workspace details';
        });
};

export const getWorkspaces = async (): Promise<Workspace[] | string> => {
    return await apiService
        .get('/workspaces')
        .then((res) => {
            return res.data;
        })
        .catch(({ response }) => {
            return response.data?.message || 'Unknown error while updating workspace details';
        });
};
