package com.nsa.bt.scrumble.services.implementations;

import com.nsa.bt.scrumble.dto.Issue;
import com.nsa.bt.scrumble.dto.Project;
import com.nsa.bt.scrumble.errorhandlers.MilestoneRestTemplateResponseErrorHandler;
import com.nsa.bt.scrumble.models.Sprint;
import com.nsa.bt.scrumble.repositories.ISprintRepository;
import com.nsa.bt.scrumble.repositories.IWorkspaceRepository;
import com.nsa.bt.scrumble.services.IIssueService;
import com.nsa.bt.scrumble.services.ISprintService;
import com.nsa.bt.scrumble.services.IUserService;
import io.opentracing.Span;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SprintService implements ISprintService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SprintService.class);
    private final RestTemplate restTemplate;
    @Autowired
    IIssueService issueService;
    @Autowired
    IUserService userService;
    @Value("${app.issues.provider.gitlab.baseUrl.api}")
    private String gitLabApiUrl;
    @Autowired
    private ISprintRepository sprintRepository;
    @Autowired
    private IWorkspaceRepository workspaceRepository;

    @Autowired
    ServiceTracer serviceTracer;

    @Autowired
    public SprintService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .errorHandler(new MilestoneRestTemplateResponseErrorHandler())
                .build();
    }

    @Override
    public Sprint createSprint(int workspaceId, Sprint sprint, String accessToken, Span parentSpan) {
        var span = serviceTracer.getTracer().buildSpan("Create Sprint").asChildOf(parentSpan).start();
        var projectMilestoneIds = new HashMap<String, Integer>();
        ArrayList<Integer> projectIds = workspaceRepository.projectIdsForWorkspace(workspaceId, span);

        for (int projectId : projectIds) {
            String uri = String.format("%s/projects/%d/milestones?title=%s&description=%s&start_date=%tF&due_date=%tF&access_token=%s",
                    gitLabApiUrl, projectId, sprint.getTitle(), sprint.getDescription(), sprint.getStartDate(), sprint.getDueDate(), accessToken);
            Sprint milestone = restTemplate.postForObject(uri, null, Sprint.class);
            projectMilestoneIds.put(Integer.toString(projectId), milestone.getId());
        }
        sprint.setProjectIdToMilestoneIds(projectMilestoneIds);
        sprint = sprintRepository.createSprint(workspaceId, sprint, span);
        span.finish();
        return sprint;
    }

    @Override
    public Sprint editSprint(int workspaceId, Sprint sprint, String accessToken, Span parentSpan) {
        var span = serviceTracer.getTracer().buildSpan("Edit Sprint").asChildOf(parentSpan).start();
        for (Map.Entry<String, Integer> pair : sprintRepository.getProjectIdsToMilestoneIds(sprint.getId(), span).entrySet()) {
            editGitLabMilestone(Integer.parseInt(pair.getKey()), pair.getValue(), sprint, accessToken, span);
        }
        sprint = sprintRepository.editSprint(workspaceId, sprint, span);
        span.finish();
        return sprint;
    }

    @Override
    public List<Sprint> getSprintsForWorkspace(int workspaceId, String filter, Span parentSpan) {
        var span = serviceTracer.getTracer().buildSpan("Get Sprints for Workspace").asChildOf(parentSpan).start();
        var sprints = sprintRepository.getAllSprintsForWorkspace(workspaceId, filter, span);
        span.finish();
        return sprints;
    }

    @Override
    public Issue setSprintForIssue(int workspaceId, Issue issue, List<Sprint> sprints, Span parentSpan) {
        var span = serviceTracer.getTracer().buildSpan("Set Sprint for Issue").asChildOf(parentSpan).start();
        // Initial assigning of sprint will be milestone data from api. If present, milestone values
        // must be swapped with Scrumble sprint values for future operations. Most importantly, id needs to be changed
        if (issue.getSprint() == null) {
            span.finish();
            return issue;
        }

        for (Sprint sprint : sprints) {
            for (Map.Entry<String, Integer> pair : sprint.getProjectIdToMilestoneIds().entrySet()) {
                // Look for a Scrumble sprint that includes the issue's milestone
                if (issue.getSprint().getId() == pair.getValue()) {
                    issue.setSprint(sprint);
                    span.finish();
                    return issue;
                }
            }
        }
        span.finish();
        return issue;
    }

    @Override
    public int getMilestoneId(int workspaceId, int projectId, int sprintId, Span parentSpan) {
        var span = serviceTracer.getTracer().buildSpan("Get Milestone ID").asChildOf(parentSpan).start();
        if (sprintId == 0) {
            span.finish();
            return sprintId;
        }
        Sprint sprint = sprintRepository.getSprintById(sprintId, span);

        try {
            span.finish();
            return sprint.getProjectIdToMilestoneIds().get(Integer.toString(projectId));
        } catch (NullPointerException e) {
            LOGGER.error(String.format("Project with id %d does not have a corresponding milestone for sprint with id %d", projectId, sprintId));
        }
        span.finish();
        return 0;
    }

    private void editGitLabMilestone(int projectId, int milestoneId, Sprint sprint,
                                     String accessToken, Span parentSpan) {
        // Just here to fulfill mandatory reqs, not actually used.
        var span = serviceTracer.getTracer().buildSpan("Edit GitLab Milestone").asChildOf(parentSpan).start();
        String stateEvent = (sprint.getStatus().equalsIgnoreCase("active")) ? "activate" : "close";
        String uri = String.format("%s/projects/%d/milestones/%d?title=%s&description=%s&start_date=%tF&due_date=%tF&state_event=%s&access_token=%s",
                gitLabApiUrl, projectId, milestoneId, sprint.getTitle(), sprint.getDescription(), sprint.getStartDate(), sprint.getDueDate(), stateEvent, accessToken);
        restTemplate.exchange(uri, HttpMethod.PUT, null, String.class);
        span.finish();
    }

    @Override
    public ArrayList<Issue> getSprintIssues(int workspaceId, Sprint sprint, String accessToken, Span parentSpan) {
        var span = serviceTracer.getTracer().buildSpan("Edit GitLab Milestone").asChildOf(parentSpan).start();
        ArrayList<Issue> allIssues = new ArrayList();

        String projectUri = String.format("%s/projects?access_token=%s&simple=true&membership=true", gitLabApiUrl, accessToken);
        ResponseEntity<Project[]> userProjectsResponse = restTemplate.getForEntity(projectUri, Project[].class);
        Project[] projects = userProjectsResponse.getBody();

        for (Map.Entry<String, Integer> entry : sprint.getProjectIdToMilestoneIds().entrySet()) {
            String projectId = entry.getKey();
            Integer milestoneId = entry.getValue();
            String uri = String.format("%s/projects/%s/milestones/%s/issues?access_token=%s",
                    gitLabApiUrl, projectId, milestoneId, accessToken);
            ResponseEntity<ArrayList<Issue>> issueResponse = restTemplate.exchange(
                    uri, HttpMethod.GET, getApplicationJsonHeaders(), new ParameterizedTypeReference<>() {
                    });
            ArrayList<Issue> issues = issueResponse.getBody();
            issues.forEach((issue) -> {
                issueService.setStoryPoint(issue, span);
                issueService.setStatus(issue);
                issueService.setProjectName(issue, projects, span);
                if (issue.getAssignee() != null) {
                    userService.setProjectId(workspaceId, issue);
                }
            });
            allIssues.addAll(issues);
        }
        span.finish();
        return allIssues;
    }

    private HttpEntity<String> getApplicationJsonHeaders() {
        var headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        return new HttpEntity(headers);
    }
}
