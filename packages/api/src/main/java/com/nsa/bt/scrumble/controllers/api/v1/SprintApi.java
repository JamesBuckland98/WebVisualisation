package com.nsa.bt.scrumble.controllers.api.v1;

import com.nsa.bt.scrumble.models.Sprint;
import com.nsa.bt.scrumble.security.UserPrincipal;
import com.nsa.bt.scrumble.services.ISprintService;
import com.nsa.bt.scrumble.services.IUserService;
import io.opentracing.Span;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class SprintApi {

    @Autowired
    private IUserService userService;

    @Autowired
    private ISprintService sprintService;

    @Value("${app.msg.error.auth}")
    private String authErrorMsg;

    @Autowired
    private ApiTracer apiTracer;

    @GetMapping("/workspace/{workspaceId}/sprints")
    public ResponseEntity<Object> getWorkspaceSprints(
            Authentication auth,
            @PathVariable(value = "workspaceId") int workspaceId,
            @RequestParam(value = "filter") String filter
    ) {
        Span span = apiTracer.getTracer().buildSpan("HTTP GET /workspace/" + workspaceId + "/sprints").start();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        Optional<String> accessTokenOptional = userService.getToken(userPrincipal.getId(), span);
        if (accessTokenOptional.isPresent()) {
            var sprints = sprintService.getSprintsForWorkspace(workspaceId, filter, span);
            span.finish();
            return ResponseEntity.ok().body(sprints);
        }
        span.finish();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(authErrorMsg);
    }

    @PostMapping("/workspace/{workspaceId}/sprint")
    public ResponseEntity<Object> createSprint(
            Authentication auth,
            @PathVariable(value = "workspaceId") int workspaceId,
            @RequestBody Sprint sprint
    ) {
        Span span = apiTracer.getTracer().buildSpan("HTTP POST /workspace/" + workspaceId + "/sprint").start();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        Optional<String> accessTokenOptional = userService.getToken(userPrincipal.getId(), span);
        var response = accessTokenOptional.<ResponseEntity<Object>>map(s ->
                ResponseEntity.ok().body(sprintService.createSprint(workspaceId, sprint, s, span))).orElseGet(() ->
                ResponseEntity.status(HttpStatus.FORBIDDEN).body(authErrorMsg)
        );
        span.finish();
        return response;
    }

    @PutMapping("/workspace/{workspaceId}/sprint")
    public ResponseEntity<Object> editSprint(
            Authentication auth,
            @PathVariable(value = "workspaceId") int workspaceId,
            @RequestBody Sprint sprint
    ) {
        Span span = apiTracer.getTracer().buildSpan("HTTP PUT /workspace/" + workspaceId + "/sprint").start();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        Optional<String> accessTokenOptional = userService.getToken(userPrincipal.getId(), span);
        if (accessTokenOptional.isPresent()) {
            sprint = sprintService.editSprint(workspaceId, sprint, accessTokenOptional.get(), span);
            span.finish();
            return ResponseEntity.ok().body(sprint);
        }
        span.finish();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", authErrorMsg));
    }

    // POST Method to get data? What a quality engineer, ladies and gentlemen.
    @PostMapping("/workspace/{workspaceId}/sprint/issues")
    public ResponseEntity<Object> getSprintIssues(
            Authentication auth,
            @PathVariable(value = "workspaceId") int workspaceId,
            @RequestBody Sprint sprint
    ) {
        // Just here to fulfill mandatory reqs, not actually used.
        Span span = apiTracer.getTracer().buildSpan("HTTP PUT /workspace/" + workspaceId + "/sprint").start();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        Optional<String> accessTokenOptional = userService.getToken(userPrincipal.getId(), span);
        if (accessTokenOptional.isPresent()) {
            var issues = sprintService.getSprintIssues(workspaceId, sprint, accessTokenOptional.get(), span);
            span.finish();
            return ResponseEntity.ok().body(issues);
        }
        span.finish();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", authErrorMsg));
    }
}
