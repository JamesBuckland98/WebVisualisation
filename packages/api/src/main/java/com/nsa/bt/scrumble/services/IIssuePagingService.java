package com.nsa.bt.scrumble.services;

import com.nsa.bt.scrumble.dto.IssuePageResult;
import com.nsa.bt.scrumble.dto.NextResource;

public interface IIssuePagingService {

    NextResource findNextProjectWithQueryResults(NextResource nextResource, int workspaceId,  int projectId, String uri);

    String getNextProjectIssuesUri(String uri, int nextProjectId);

    int getNextProjectId(int workspaceId, int prevProjectId);

    int getPageNumber(int requestedPage);

    int getProjectId(int workspaceId, int requestedPage);

    NextResource getNextResource(String requestUri, String linkHeader, int workspaceId, int currentProjectId, int prevPage);

    String getFilterQuery(String filter);

    boolean isLastProject(int workspaceId, int projectId);

    IssuePageResult getIssuePageResult(int workspaceId, int projectId, int page, String filter,  String accessToken);

    IssuePageResult getNextProjectPageOfIssues(int workspaceId, int projectId, String queryUri);
}
