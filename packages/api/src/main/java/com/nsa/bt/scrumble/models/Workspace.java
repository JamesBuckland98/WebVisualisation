package com.nsa.bt.scrumble.models;

import java.util.ArrayList;
import java.util.List;

public class Workspace {
    private int id;
    private User createdBy;
    private String name;
    private String description;
    private ArrayList<Integer> projectIds;
    private List<User> users;

    public Workspace(int id, User createdBy, String name,
                     String description, ArrayList<Integer> projectIds,
                     List<User> users) {
        this.id = id;
        this.createdBy = createdBy;
        this.name = name;
        this.description = description;
        this.projectIds = projectIds;
        this.users = users;
    }

    public Workspace() {
    }

    public ArrayList<Integer> getProjectIds() {
        return projectIds;
    }

    public void setProjectIds(ArrayList<Integer> projectIds) {
        this.projectIds = projectIds;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
