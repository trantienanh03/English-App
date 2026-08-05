package org.englishapp.backend.dto;

public class SyncResponse {
    private String status;
    private int rank;

    public SyncResponse() {}

    public SyncResponse(String status, int rank) {
        this.status = status;
        this.rank = rank;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
}
