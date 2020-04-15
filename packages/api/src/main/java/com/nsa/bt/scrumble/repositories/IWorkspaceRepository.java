package com.nsa.bt.scrumble.repositories;

import com.nsa.bt.scrumble.models.User;
import com.nsa.bt.scrumble.models.Workspace;

import java.util.ArrayList;
import java.util.List;

public interface IWorkspaceRepository {

    ArrayList<Integer> projectIdsForWorkspace(int workspaceId);

    List<User> workspaceUserList(int workspaceId);

    Workspace createWorkspace(Workspace workspace, User user);

    List<Workspace> getAllWorkspaces();

    void deleteWorkspace(int workspaceId);

    void editWorkspace(Workspace updatedWorkspace);
}
