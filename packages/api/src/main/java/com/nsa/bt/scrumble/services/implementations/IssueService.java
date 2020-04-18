package com.nsa.bt.scrumble.services.implementations;

import com.nsa.bt.scrumble.dto.Issue;
import com.nsa.bt.scrumble.dto.Project;
import com.nsa.bt.scrumble.regression.LinearRegression;
import com.nsa.bt.scrumble.services.IIssueService;

import com.nsa.bt.scrumble.services.ISprintService;
import io.opentracing.Span;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class IssueService implements IIssueService {

    private static final String UNPLANNED = "unplanned";
    private static final String OPENED = "opened";
    private static final String CLOSED = "closed";

    @Value("${app.issues.provider.gitlab.baseUrl.api}")
    private String gitLabApiUrl;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    WorkspaceService workspaceService;

    @Autowired
    ISprintService sprintService;

    @Autowired
    LinearRegression linearRegression;

    @Override
    public void setStoryPoint(Issue issue, Span span) {
        span = ServiceTracer.getTracer().buildSpan("Set Story Point").asChildOf(span).start();
        OptionalInt storyPoint =issue.getLabels()
                .stream()
                .filter(IssueService::isInteger)
                .mapToInt(Integer::parseInt)
                .findFirst();

        if(storyPoint.isPresent()) {
            issue.setStoryPoint(storyPoint.getAsInt());
        }
        span.finish();
    }

    // Ref: https://stackoverflow.com/a/5439547/11679751
    public static boolean isInteger(String s) {
        return isInteger(s,10);
    }

    public static boolean isInteger(String s, int radix) {
        if(s.isEmpty()) return false;
        for(int i = 0; i < s.length(); i++) {
            if(i == 0 && s.charAt(i) == '-') {
                if(s.length() == 1) return false;
                else continue;
            }
            if(Character.digit(s.charAt(i),radix) < 0) return false;
        }
        return true;
    }

    @Override
    public String getFilterQuery(String filter, Span span) {
        span = ServiceTracer.getTracer().buildSpan("Get Filter Query").asChildOf(span).start();
        switch (filter) {
            case UNPLANNED:
                span.finish();
                return "labels=unplanned";
            case OPENED:
                span.finish();
                return "state=opened";
            case CLOSED:
                span.finish();
                return "state=closed";
            default:
                span.finish();
                return "scope=all";
        }
    }

    @Override
    public void setProjectName(Issue issue, Project[] projects, Span span) {
        span = ServiceTracer.getTracer().buildSpan("Set Project Name").asChildOf(span).start();
        for (Project project : projects) {
            if (issue.getProjectId() == project.getId()) {
                issue.setProjectName(project.getName());
                return;
            }
        }
        span.finish();
    }

    @Override
    public Issue createIssue(int workspaceId, int projectId,  Issue issue, String accessToken, Span span) {
        span = ServiceTracer.getTracer().buildSpan("Create Issue").asChildOf(span).start();
        String issueUri = getIssueUri(workspaceId, projectId, issue, accessToken);
        String projectUri = String.format("%s/projects?access_token=%s&simple=true&membership=true",
                gitLabApiUrl, accessToken);
        ResponseEntity<Project[]> userProjectsResponse = restTemplate.getForEntity(projectUri, Project[].class);
        Project[] projects = userProjectsResponse.getBody();
        Issue newIssue = restTemplate.postForObject(issueUri, null , Issue.class);
        setStoryPoint(newIssue, span);
        setProjectName(newIssue, projects, span);
        linearRegression.setEstimate(projectId, newIssue, accessToken);
        span.finish();
        return newIssue;
    }

    @Override
    public Issue editIssue(int workspaceId, int projectId, Issue issue, String accessToken, Span span) {
        span = ServiceTracer.getTracer().buildSpan("Edit Issue").asChildOf(span).start();
        String uri;

        if(issue.getSprint() != null ) {
            int milestoneId = sprintService.getMilestoneId(workspaceId, projectId, issue.getSprint().getId());
            uri = String.format("%s/projects/%s/issues/%s?title=%s&description=%s&labels=%s&assignee_ids[]=%s&milestone_id=%d&access_token=%s",
                    gitLabApiUrl,projectId,issue.getIid(),issue.getTitle(),issue.getDescription(),issue.getStoryPoint(),issue.getAssignee().getId(), milestoneId, accessToken);
        } else {
            uri = String.format("%s/projects/%s/issues/%s?title=%s&description=%s&labels=%s&assignee_ids[]=%s&access_token=%s",
                    gitLabApiUrl,projectId,issue.getIid(),issue.getTitle(),issue.getDescription(),issue.getStoryPoint(),issue.getAssignee().getId(), accessToken);
        }

        restTemplate.exchange(uri, HttpMethod.PUT, null, Void.class);
        linearRegression.setEstimate(projectId, issue, accessToken);
        span.finish();
        return issue;
    }

    private String getIssueUri(int workspaceId, int projectId, Issue issue, String accessToken) {
        if (issue.getSprint()!= null) {
            int milestoneId = sprintService.getMilestoneId(workspaceId, projectId, issue.getSprint().getId());
            return String.format("%s/projects/%s/issues?title=%s&description=%s&labels=%s&assignee_ids[]=%s&milestone_id=%d&access_token=%s",
                    gitLabApiUrl, projectId, issue.getTitle(), issue.getDescription(), issue.getStoryPoint(), issue.getAssignee().getId(), milestoneId, accessToken);
        } else {
            return String.format("%s/projects/%s/issues?title=%s&description=%s&labels=%s&assignee_ids[]=%s&access_token=%s",
                    gitLabApiUrl, projectId, issue.getTitle(), issue.getDescription(), issue.getStoryPoint(), issue.getAssignee().getId(), accessToken);
        }
    }
}
