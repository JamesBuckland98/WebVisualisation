package com.nsa.bt.scrumble.services;

import com.nsa.bt.scrumble.models.User;
import com.nsa.bt.scrumble.models.Workspace;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface IWorkspaceService {

    ArrayList<Integer> getProjectIdsForWorkspace(int workspaceId);

    Workspace createWorkspace(Workspace workspace, User user);

    List<Workspace> getAllWorkspaces();

    void deleteWorkspace(int workspaceId);

    void editWorkspace(Workspace updatedWorkspace);

    void setWorkspaceUsers(Workspace workspace, Optional<String> accessToken);
}
