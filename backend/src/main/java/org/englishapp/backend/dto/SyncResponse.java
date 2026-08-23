package org.englishapp.backend.dto;

public class SyncResponse {
    private String status;

    public SyncResponse() {}

    public SyncResponse(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
